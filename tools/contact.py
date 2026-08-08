#!/usr/bin/env python3
"""Render a numbered contact sheet from a crops directory for hand-labeling."""

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

crops_dir = Path(sys.argv[1])
out_path = Path(sys.argv[2])
cell_w, cell_h, cols = 150, 190, 8

manifest = json.loads((crops_dir / "manifest.json").read_text())
rows = (len(manifest) + cols - 1) // cols
sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), (24, 26, 32))
draw = ImageDraw.Draw(sheet)
for i, entry in enumerate(manifest):
    img = Image.open(crops_dir / f"{entry['name']}.png")
    scale = min((cell_w - 8) / img.width, (cell_h - 28) / img.height, 1.0)
    img = img.resize((max(1, int(img.width * scale)), max(1, int(img.height * scale))))
    cx, cy = (i % cols) * cell_w, (i // cols) * cell_h
    sheet.paste(img, (cx + (cell_w - img.width) // 2, cy + 22), img)
    draw.text((cx + 6, cy + 4), f"{i:03d}", fill=(255, 210, 80))
    draw.rectangle([cx, cy, cx + cell_w - 1, cy + cell_h - 1], outline=(60, 64, 76))
sheet.save(out_path)
print(f"{len(manifest)} crops -> {out_path}")
