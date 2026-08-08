#!/usr/bin/env python3
"""Generate placeholder HOME tiles/props (until a real home sheet exists).

Same muted palette as the AI sheets. Every file lands under home/ so real art
can replace the PNGs later without touching game code.
"""

import random
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "assets" / "sprites" / "home"
OUT.mkdir(parents=True, exist_ok=True)
random.seed(7)


def noisy_rect(d: ImageDraw.ImageDraw, box, color, jitter=6, n=40):
    d.rectangle(box, fill=color)
    x0, y0, x1, y1 = box
    for _ in range(n):
        x = random.randint(x0, max(x0, x1 - 1))
        y = random.randint(y0, max(y0, y1 - 1))
        c = tuple(min(255, max(0, v + random.randint(-jitter, jitter))) for v in color)
        d.point((x, y), fill=c)


def save(name: str, img: Image.Image):
    img.save(OUT / f"{name}.png")


# --- floor: warm wood planks, 64x64 (tiles as 32px cells) -------------------
wood = Image.new("RGB", (64, 64))
d = ImageDraw.Draw(wood)
plank_colors = [(94, 74, 58), (101, 80, 62), (88, 69, 54), (97, 77, 60)]
for row in range(4):
    y0 = row * 16
    off = (row % 2) * 24
    for x0 in (-24, 8, 40):
        sx = max(0, x0 + off)
        ex = min(63, x0 + off + 31)
        if sx > ex:
            continue
        c = random.choice(plank_colors)
        noisy_rect(d, (sx, y0, ex, y0 + 15), c, 5, 60)
        d.line([(sx, y0), (sx, y0 + 15)], fill=(70, 55, 44))
    d.line([(0, y0 + 15), (63, y0 + 15)], fill=(74, 58, 46))
save("floor-wood", wood)

# --- wall: warm cream with skirting, 64x48 ---------------------------------
wall = Image.new("RGB", (64, 48))
d = ImageDraw.Draw(wall)
noisy_rect(d, (0, 0, 63, 39), (196, 186, 168), 4, 60)
noisy_rect(d, (0, 40, 63, 47), (120, 100, 82), 4, 20)
save("wall", wall)

# --- rug 96x64 --------------------------------------------------------------
rug = Image.new("RGBA", (96, 64), (0, 0, 0, 0))
d = ImageDraw.Draw(rug)
noisy_rect(d, (0, 0, 95, 63), (130, 112, 118), 5, 120)
d.rectangle((0, 0, 95, 63), outline=(108, 92, 98))
d.rectangle((6, 6, 89, 57), outline=(150, 132, 138))
save("rug", rug)


def block(name, w, h, body, top=None, outline=(40, 38, 40)):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    noisy_rect(d, (0, 0, w - 1, h - 1), body, 6, w * h // 40)
    if top:
        noisy_rect(d, (0, 0, w - 1, h // 3), top, 6, w * h // 90)
    d.rectangle((0, 0, w - 1, h - 1), outline=outline)
    return img


# furniture blocks (muted palette)
save("bed-double", block("bed-double", 64, 84, (146, 150, 162), (196, 196, 200)))
save("couch", block("couch", 84, 40, (94, 104, 122), (120, 130, 148)))
save("table", block("table", 56, 40, (110, 88, 68), (128, 104, 80)))
save("kitchen-counter", block("kitchen-counter", 96, 32, (156, 158, 164), (188, 190, 196)))
save("wardrobe", block("wardrobe", 48, 28, (104, 84, 66)))
save("tv-stand", block("tv-stand", 64, 24, (70, 72, 82), (30, 32, 40)))

# crib: light wood with bars
crib = Image.new("RGBA", (56, 44), (0, 0, 0, 0))
d = ImageDraw.Draw(crib)
noisy_rect(d, (0, 0, 55, 43), (168, 142, 112), 6, 60)
d.rectangle((6, 8, 49, 35), fill=(214, 208, 198))
for x in range(6, 50, 6):
    d.line([(x, 2), (x, 42)], fill=(140, 116, 90))
d.rectangle((0, 0, 55, 43), outline=(110, 90, 70))
save("crib", crib)

# crib mobile (hangs above crib)
mob = Image.new("RGBA", (24, 20), (0, 0, 0, 0))
d = ImageDraw.Draw(mob)
d.arc((2, 0, 21, 14), 200, 340, fill=(120, 120, 130))
for i, c in enumerate([(190, 160, 90), (120, 150, 180), (170, 120, 130)]):
    d.ellipse((3 + i * 7, 10, 8 + i * 7, 15), fill=c)
save("crib-mobile", mob)

# stuffed bear
bear = Image.new("RGBA", (14, 16), (0, 0, 0, 0))
d = ImageDraw.Draw(bear)
d.ellipse((2, 6, 11, 15), fill=(158, 124, 92))
d.ellipse((3, 0, 10, 8), fill=(168, 134, 100))
d.ellipse((2, 0, 5, 3), fill=(168, 134, 100))
d.ellipse((8, 0, 11, 3), fill=(168, 134, 100))
save("bear", bear)

# hospital bag
bag = Image.new("RGBA", (26, 22), (0, 0, 0, 0))
d = ImageDraw.Draw(bag)
noisy_rect(d, (0, 6, 25, 21), (86, 96, 118), 6, 30)
d.arc((6, 0, 19, 12), 180, 360, fill=(60, 68, 86))
d.rectangle((0, 6, 25, 21), outline=(52, 58, 74))
save("bag", bag)

# car-seat box (cardboard, unopened)
box_img = Image.new("RGBA", (30, 26), (0, 0, 0, 0))
d = ImageDraw.Draw(box_img)
noisy_rect(d, (0, 0, 29, 25), (150, 122, 88), 6, 40)
d.line([(0, 8), (29, 8)], fill=(120, 96, 68))
d.line([(14, 0), (14, 8)], fill=(120, 96, 68))
d.rectangle((4, 12, 25, 21), outline=(120, 96, 68))
d.rectangle((0, 0, 29, 25), outline=(104, 84, 60))
save("car-seat-box", box_img)

# key hook (wall) + keys
hook = Image.new("RGBA", (18, 22), (0, 0, 0, 0))
d = ImageDraw.Draw(hook)
d.rectangle((0, 0, 17, 5), fill=(110, 88, 68), outline=(90, 72, 55))
d.line([(4, 6), (4, 10)], fill=(160, 160, 170))
d.line([(13, 6), (13, 10)], fill=(160, 160, 170))
d.ellipse((2, 10, 7, 15), outline=(200, 190, 120))
d.rectangle((3, 15, 5, 20), fill=(200, 190, 120))
save("key-hook", hook)
d.rectangle((0, 6, 17, 21), fill=(0, 0, 0, 0))
save("key-hook-empty", hook)

# dog bed (the dog itself is a missing asset; its bed sits in the scene)
dogbed = Image.new("RGBA", (36, 24), (0, 0, 0, 0))
d = ImageDraw.Draw(dogbed)
d.ellipse((0, 0, 35, 23), fill=(112, 96, 88), outline=(90, 76, 70))
d.ellipse((6, 5, 29, 19), fill=(140, 124, 112))
save("dog-bed", dogbed)

# interior door
door = Image.new("RGBA", (30, 44), (0, 0, 0, 0))
d = ImageDraw.Draw(door)
noisy_rect(d, (0, 0, 29, 43), (128, 100, 74), 5, 40)
d.rectangle((4, 6, 25, 20), outline=(104, 82, 60))
d.rectangle((4, 26, 25, 38), outline=(104, 82, 60))
d.ellipse((23, 21, 26, 24), fill=(190, 180, 120))
d.rectangle((0, 0, 29, 43), outline=(92, 72, 52))
save("door", door)

# window (wall-mounted)
win = Image.new("RGBA", (36, 26), (0, 0, 0, 0))
d = ImageDraw.Draw(win)
d.rectangle((0, 0, 35, 25), fill=(150, 170, 188), outline=(110, 96, 80))
d.line([(17, 0), (17, 25)], fill=(110, 96, 80))
d.line([(0, 12), (35, 12)], fill=(110, 96, 80))
save("window", win)

print(f"placeholder home set -> {OUT}")

# the dog (placeholder until a real sprite exists): small brown blob, ears, tail
dog = Image.new("RGBA", (20, 14), (0, 0, 0, 0))
d = ImageDraw.Draw(dog)
d.ellipse((1, 4, 16, 13), fill=(122, 92, 62))          # body
d.ellipse((10, 1, 19, 9), fill=(130, 99, 68))          # head
d.polygon([(11, 1), (13, -2), (14, 2)], fill=(104, 78, 52))   # ear
d.polygon([(16, 1), (18, -2), (19, 2)], fill=(104, 78, 52))   # ear
d.ellipse((15, 4, 17, 6), fill=(30, 26, 22))           # eye
d.line([(1, 6), (-2, 3)], fill=(122, 92, 62), width=2) # tail
save("dog", dog)
dog2 = dog.transpose(Image.FLIP_LEFT_RIGHT)
save("dog-flip", dog2)
