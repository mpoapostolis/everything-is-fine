from pathlib import Path
from shutil import copy2

from PIL import Image, ImageDraw, ImageEnhance, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "itchio-launch-kit" / "branding"
FONT = ROOT / "public" / "assets" / "fonts" / "VT323.ttf"

COVER_SOURCE = Path(
    "/Users/mpoapostolis/.codex/generated_images/019fe2a9-4ecd-7961-a4a2-294bd0a07906/"
    "exec-839d2a4a-be96-41c7-bfe4-f0b1b1537d27.png"
)
BANNER_SOURCE = Path(
    "/Users/mpoapostolis/.codex/generated_images/019fe2a9-4ecd-7961-a4a2-294bd0a07906/"
    "exec-89138179-be8e-4c20-a0ef-fbd81ad0947c.png"
)


def cover() -> None:
    image = Image.open(COVER_SOURCE).convert("RGB")
    target_ratio = 630 / 500
    source_ratio = image.width / image.height
    if source_ratio > target_ratio:
        width = round(image.height * target_ratio)
        left = (image.width - width) // 2
        image = image.crop((left, 0, left + width, image.height))
    else:
        height = round(image.width / target_ratio)
        top = (image.height - height) // 2
        image = image.crop((0, top, image.width, top + height))
    image = image.resize((630, 500), Image.Resampling.LANCZOS)

    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for y in range(205):
        alpha = round(170 * (1 - y / 205))
        draw.line((0, y, 630, y), fill=(5, 7, 11, alpha))
    image = Image.alpha_composite(image.convert("RGBA"), overlay)

    draw = ImageDraw.Draw(image)
    title = ImageFont.truetype(str(FONT), 70)
    subtitle = ImageFont.truetype(str(FONT), 24)
    draw.text(
        (315, 28),
        "EVERYTHING IS FINE",
        font=title,
        anchor="ma",
        fill="#e8e6df",
        stroke_width=3,
        stroke_fill="#05070b",
    )
    draw.text(
        (315, 98),
        "A TRUE STORY",
        font=subtitle,
        anchor="ma",
        fill="#8fa3bf",
        stroke_width=2,
        stroke_fill="#05070b",
    )
    image.convert("RGB").save(OUT / "cover-630x500.png", optimize=True)


def banner() -> None:
    image = Image.open(BANNER_SOURCE).convert("RGB")
    crop_height = round(image.width / (960 / 300))
    top = min(max(220, 0), image.height - crop_height)
    image = image.crop((0, top, image.width, top + crop_height))
    image = image.resize((960, 300), Image.Resampling.LANCZOS).convert("RGBA")

    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for x in range(590):
        alpha = round(105 * (1 - x / 590))
        draw.line((x, 0, x, 300), fill=(5, 7, 11, alpha))
    image = Image.alpha_composite(image, overlay)

    draw = ImageDraw.Draw(image)
    title = ImageFont.truetype(str(FONT), 64)
    subtitle = ImageFont.truetype(str(FONT), 25)
    draw.text(
        (54, 56),
        "EVERYTHING\nIS FINE",
        font=title,
        spacing=-8,
        fill="#e8e6df",
        stroke_width=3,
        stroke_fill="#05070b",
    )
    draw.text(
        (58, 205),
        "A TRUE STORY",
        font=subtitle,
        fill="#8fa3bf",
        stroke_width=2,
        stroke_fill="#05070b",
    )
    image.convert("RGB").save(OUT / "banner-960x300.png", optimize=True)


def embed_background() -> None:
    image = Image.open(BANNER_SOURCE).convert("RGB")
    target_ratio = 16 / 9
    width = round(image.height * target_ratio)
    left = (image.width - width) // 2
    image = image.crop((left, 0, left + width, image.height))
    image = image.resize((1280, 720), Image.Resampling.LANCZOS)
    image = ImageEnhance.Brightness(image).enhance(0.72)
    image.save(OUT / "embed-background-1280x720.png", optimize=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    copy2(COVER_SOURCE, OUT / "key-art-cover-source.png")
    copy2(BANNER_SOURCE, OUT / "key-art-banner-source.png")
    cover()
    banner()
    embed_background()


if __name__ == "__main__":
    main()
