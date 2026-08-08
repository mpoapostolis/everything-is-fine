#!/usr/bin/env python3
"""Slice AI-generated sprite sheets into transparent crops.

Approach: the sheets have smooth (flat or gradient) backgrounds and busy,
outlined sprites. A pixel is background-like when the image is locally smooth
around it; the true background is every background-like region connected to
the image border. Everything else is foreground. Foreground connected
components become crops (with alpha), merged when boxes nearly touch.

Usage:
  python3 tools/slice.py assets-raw/player.png --out build/crops/player \
      [--smooth 6.0] [--min-area 400] [--gap 6]
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image


def box_filter_2d(a: np.ndarray, r: int) -> np.ndarray:
    """Mean filter with window (2r+1) using cumsum; edge-padded."""
    pad = np.pad(a, r + 1, mode="edge")
    c = pad.cumsum(0).cumsum(1)
    w = 2 * r + 1
    s = c[w:, w:] - c[:-w, w:] - c[w:, :-w] + c[:-w, :-w]
    return s[: a.shape[0], : a.shape[1]] / (w * w)


def local_smoothness_mask(rgb: np.ndarray, thresh: float, r: int = 2) -> np.ndarray:
    """True where local color variance is low (background-like)."""
    f = rgb.astype(np.float32)
    var = np.zeros(rgb.shape[:2], np.float32)
    for ch in range(3):
        m = box_filter_2d(f[:, :, ch], r)
        m2 = box_filter_2d(f[:, :, ch] ** 2, r)
        var += np.maximum(m2 - m * m, 0.0)
    return np.sqrt(var) < thresh


class DSU:
    def __init__(self) -> None:
        self.p: dict[int, int] = {}

    def find(self, x: int) -> int:
        while self.p.setdefault(x, x) != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def union(self, a: int, b: int) -> None:
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.p[rb] = ra


def label_components(mask: np.ndarray) -> tuple[np.ndarray, int]:
    """Run-length two-pass connected-component labeling (4-connectivity)."""
    h, w = mask.shape
    labels = np.zeros((h, w), np.int32)
    dsu = DSU()
    nxt = 1
    prev_runs: list[tuple[int, int, int]] = []  # (x0, x1, label), x1 exclusive
    for y in range(h):
        row = mask[y]
        runs: list[tuple[int, int, int]] = []
        x = 0
        idx = np.flatnonzero(np.diff(np.concatenate(([0], row.view(np.int8), [0]))))
        for i in range(0, len(idx), 2):
            x0, x1 = int(idx[i]), int(idx[i + 1])
            lbl = 0
            for px0, px1, plbl in prev_runs:
                if px0 < x1 and x0 < px1:  # overlap with previous row run
                    if lbl == 0:
                        lbl = plbl
                    else:
                        dsu.union(lbl, plbl)
            if lbl == 0:
                lbl = nxt
                nxt += 1
            dsu.find(lbl)
            labels[y, x0:x1] = lbl
            runs.append((x0, x1, lbl))
        prev_runs = runs
        _ = x
    # flatten labels
    if nxt > 1:
        lut = np.zeros(nxt, np.int32)
        for i in range(1, nxt):
            lut[i] = dsu.find(i)
        labels = lut[labels]
    return labels, nxt


def background_mask(rgb: np.ndarray, smooth_thresh: float) -> np.ndarray:
    smooth = local_smoothness_mask(rgb, smooth_thresh)
    return border_connected(smooth)


def border_connected(mask: np.ndarray) -> np.ndarray:
    labels, _ = label_components(mask)
    border = np.unique(
        np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])
    )
    border = border[border != 0]
    return np.isin(labels, border)


def color_background_mask(rgb: np.ndarray, tol: float) -> np.ndarray:
    """Background = pixels near the median border color, connected to border."""
    ring = np.concatenate(
        [rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]], axis=0
    ).astype(np.float32)
    bg_color = np.median(ring, axis=0)
    dist = np.sqrt(((rgb.astype(np.float32) - bg_color) ** 2).sum(axis=2))
    return border_connected(dist < tol)


def merge_boxes(boxes: list[list[int]], gap: int) -> list[list[int]]:
    """Merge groups of boxes whose ORIGINAL rectangles lie within `gap` px.

    Adjacency is computed on the input boxes only (no snowballing): two boxes
    join the same group when their gap-expanded rectangles intersect; groups
    are the connected components of that graph.
    """
    n = len(boxes)
    dsu = DSU()
    for i in range(n):
        ax0, ay0, ax1, ay1 = boxes[i]
        for j in range(i + 1, n):
            bx0, by0, bx1, by1 = boxes[j]
            if (
                ax0 - gap < bx1
                and bx0 - gap < ax1
                and ay0 - gap < by1
                and by0 - gap < ay1
            ):
                dsu.union(i, j)
    groups: dict[int, list[int]] = {}
    for i in range(n):
        groups.setdefault(dsu.find(i), []).append(i)
    out = []
    for members in groups.values():
        xs0, ys0, xs1, ys1 = zip(*(boxes[m] for m in members))
        out.append([min(xs0), min(ys0), max(xs1), max(ys1)])
    return out


def row_major_sort(boxes: list[list[int]]) -> list[list[int]]:
    if not boxes:
        return boxes
    heights = [b[3] - b[1] for b in boxes]
    band = max(8, int(np.median(heights) * 0.6))
    return sorted(boxes, key=lambda b: ((b[1] + (b[3] - b[1]) // 2) // band, b[0]))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("sheet")
    ap.add_argument("--out", required=True)
    ap.add_argument("--smooth", type=float, default=6.0,
                    help="local color stddev below which a pixel is background-like")
    ap.add_argument("--mode", choices=["smooth", "color"], default="smooth")
    ap.add_argument("--tol", type=float, default=28.0,
                    help="color mode: max distance from border color to count as bg")
    ap.add_argument("--min-area", type=int, default=400)
    ap.add_argument("--gap", type=int, default=6)
    args = ap.parse_args()

    img = Image.open(args.sheet).convert("RGB")
    rgb = np.asarray(img)
    if args.mode == "color":
        bg = color_background_mask(rgb, args.tol)
    else:
        bg = background_mask(rgb, args.smooth)
    fg = ~bg

    labels, _ = label_components(fg)
    boxes: list[list[int]] = []
    for lbl in np.unique(labels):
        if lbl == 0:
            continue
        ys, xs = np.nonzero(labels == lbl)
        if len(ys) < 40:  # skip specks early
            continue
        boxes.append([int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1])

    boxes = merge_boxes(boxes, args.gap)
    boxes = [b for b in boxes if (b[2] - b[0]) * (b[3] - b[1]) >= args.min_area]
    boxes = row_major_sort(boxes)

    outdir = Path(args.out)
    outdir.mkdir(parents=True, exist_ok=True)
    rgba = np.dstack([rgb, np.where(fg, 255, 0).astype(np.uint8)])
    manifest = []
    for i, (x0, y0, x1, y1) in enumerate(boxes):
        crop = rgba[y0:y1, x0:x1]
        name = f"crop_{i:03d}"
        Image.fromarray(crop, "RGBA").save(outdir / f"{name}.png")
        manifest.append({"name": name, "x": x0, "y": y0, "w": x1 - x0, "h": y1 - y0})
    (outdir / "manifest.json").write_text(json.dumps(manifest, indent=1))
    print(f"{args.sheet}: {len(boxes)} crops -> {outdir}")


if __name__ == "__main__":
    main()
