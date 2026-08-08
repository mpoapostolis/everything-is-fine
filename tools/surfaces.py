#!/usr/bin/env python3
"""Procedural floor/wall surfaces in the game's muted palette.

The AI sheets are great for characters and props but their floor patches are
noisy and read badly when tiled. These clean surfaces keep everything cohesive;
scene lighting (tint overlays) does the mood work.
"""

import random
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "assets" / "sprites"
random.seed(11)


def speckle(d, w, h, color, n, jitter):
    for _ in range(n):
        x, y = random.randint(0, w - 1), random.randint(0, h - 1)
        c = tuple(min(255, max(0, v + random.randint(-jitter, jitter))) for v in color)
        d.point((x, y), fill=c)


def floor_tile(base, grout, size=32, speckles=26, jitter=5):
    img = Image.new("RGB", (size, size), base)
    d = ImageDraw.Draw(img)
    speckle(d, size, size, base, speckles, jitter)
    d.line([(0, size - 1), (size - 1, size - 1)], fill=grout)
    d.line([(size - 1, 0), (size - 1, size - 1)], fill=grout)
    return img


def wall(base, band, skirt, w=64, h=52):
    img = Image.new("RGB", (w, h), base)
    d = ImageDraw.Draw(img)
    speckle(d, w, h - 14, base, 60, 4)
    d.rectangle([0, h - 14, w - 1, h - 6], fill=band)
    d.rectangle([0, h - 6, w - 1, h - 1], fill=skirt)
    d.line([(0, h - 14), (w - 1, h - 14)], fill=tuple(max(0, v - 18) for v in band))
    return img


def save(name, img):
    dest = OUT / f"{name}.png"
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest)


# Hospital: cold, pale, spotless-but-tired
save("surface/hosp-floor", floor_tile((189, 195, 204), (170, 176, 186)))
save("surface/hosp-floor-dim", floor_tile((156, 162, 172), (138, 144, 154)))
save("surface/hosp-wall", wall((214, 219, 226), (160, 172, 184), (94, 104, 118)))
save("surface/hosp-wall-dim", wall((178, 182, 190), (134, 144, 154), (78, 86, 98)))

# Delivery room: the same hospital, slightly warmer — she is here
save("surface/delivery-floor", floor_tile((198, 192, 182), (176, 170, 160)))
save("surface/delivery-wall", wall((216, 209, 198), (168, 158, 146), (102, 94, 84)))

# NICU: dim, warm, glass-filtered
save("surface/nicu-floor", floor_tile((142, 138, 132), (124, 120, 114), speckles=18))
save("surface/nicu-wall", wall((160, 152, 142), (122, 114, 104), (72, 66, 58)))

# Home: warm wood (finer than the placeholder), cream walls
wood = Image.new("RGB", (64, 32), (121, 92, 64))
d = ImageDraw.Draw(wood)
for row in range(2):
    y0 = row * 16
    off = (row % 2) * 32
    for x0 in range(-32, 64, 32):
        sx, ex = x0 + off, x0 + off + 31
        if ex < 0 or sx > 63:
            continue
        base = random.choice([(121, 92, 64), (131, 101, 71), (112, 84, 58)])
        d.rectangle([max(0, sx), y0, min(63, ex), y0 + 15], fill=base)
        if sx >= 0:
            d.line([(sx, y0), (sx, y0 + 15)], fill=(92, 68, 46))
    d.line([(0, y0 + 15), (63, y0 + 15)], fill=(96, 72, 50)); speckle(d, 64, 32, (121, 92, 64), 40, 6)
save("surface/home-floor", wood)
save("surface/home-wall", wall((203, 191, 170), (158, 144, 124), (112, 94, 74)))

print("surfaces ->", OUT / "surface")
