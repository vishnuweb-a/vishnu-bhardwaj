#!/usr/bin/env python3
"""Derive the site's shipped media from the owner's originals.

The originals are full-size PNGs, roughly 10 MB in total. Serving them as-is
would have put a 1.9 MB image on the hero's critical path, so every shipped
asset is a WebP derivative written to src/assets/images/ and imported through
src/features/portfolio/data/assets.js. The PNGs are never modified.

They live in information/source-assets/ rather than public/. Vite copies public/
verbatim into dist/, so while the originals sat there the whole ~10 MB shipped
on every deploy even though no page ever requests them - the derivatives are the
only media the site loads. information/ is the owner's supplied-material
directory and is not served, so the originals stay in the repository, stay
reachable by this script, and stay out of the build (CLAUDE.md section 3).

Two derivatives are made per screenshot:

  <name>.webp        the capture at source size, shown whole on the detail route
  <name>-card.webp   a 16:9 composition for the card, service and experience
                     frames, with the device sitting complete on its own
                     backdrop colour

The card composition exists because every capture is a tall device frame going
into a landscape slot. Cropping one to fit sliced the device in half; extending
its own backdrop to the frame's ratio keeps the whole screen visible and gives
each card a distinct, and honest, ground colour.

Run from the repository root:  python scripts/build-assets.py
Requires Pillow. Re-run only when information/source-assets/ changes.
"""

import os
import statistics

from PIL import Image

SRC = 'information/source-assets'
OUT = 'src/assets/images'
os.makedirs(OUT, exist_ok=True)

# 16:9 matches the service and experience frames exactly. The 1.4:1 card frame
# crops this to its central 79% of width, which the centred device clears.
CARD_W, CARD_H = 1280, 720
# Leaves a small margin so the device never touches the frame edge, and stays
# clear of the 1.4:1 crop.
DEVICE_SCALE = 0.92

# Screenshots ship at their source pixel size: the largest on-page use is the
# detail frame at roughly 460 x 830 CSS px, so the source doubles as the 2x
# asset. Only the container format changes.
SHOTS = {
    'ship-bihar.png': 'ship-bihar',
    'yarnvia.png': 'yarnvia',
    'foss.png': 'foss-club',
    'furniture.png': 'furniture',
    'expanseTracker.png': 'expense-tracker',
}


def backdrop(im):
    """Median colour of the image's border ring.

    Every capture is a device mockup on a flat studio ground, so the border is
    that ground. Median rather than mean so a stray dark pixel in a corner does
    not drag the result.
    """
    w, h = im.size
    ring = []
    for x in range(0, w, 7):
        ring.append(im.getpixel((x, 1)))
        ring.append(im.getpixel((x, h - 2)))
    for y in range(0, h, 7):
        ring.append(im.getpixel((1, y)))
        ring.append(im.getpixel((w - 2, y)))
    return tuple(round(statistics.median(c[i] for c in ring)) for i in range(3))


def trim(im, bg, tol=26):
    """Crop away the flat ground, leaving the device.

    Runs on a quarter-scale copy: the boundary only needs to be right to within
    a few pixels and the full-size scan is needlessly slow.
    """
    small = im.resize((im.width // 4, im.height // 4))
    sw, sh = small.size
    xs, ys = [], []
    for y in range(sh):
        for x in range(sw):
            p = small.getpixel((x, y))
            if abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2]) > tol:
                xs.append(x)
                ys.append(y)
    if not xs:
        return im
    return im.crop(
        (
            max(0, min(xs) - 1) * 4,
            max(0, min(ys) - 1) * 4,
            min(sw, max(xs) + 2) * 4,
            min(sh, max(ys) + 2) * 4,
        )
    )


def card(im):
    """Compose the device, whole and centred, on its own ground at 16:9."""
    bg = backdrop(im)
    device = trim(im, bg)
    scale = (CARD_H * DEVICE_SCALE) / device.height
    device = device.resize(
        (max(1, round(device.width * scale)), round(device.height * scale)),
        Image.LANCZOS,
    )
    canvas = Image.new('RGB', (CARD_W, CARD_H), bg)
    canvas.paste(
        device, ((CARD_W - device.width) // 2, (CARD_H - device.height) // 2)
    )
    return canvas, bg


def write(image, name, quality):
    path = os.path.join(OUT, name)
    image.save(path, 'WEBP', quality=quality, method=6)
    print(name, image.size, os.path.getsize(path) // 1024, 'KB')


for src, stem in SHOTS.items():
    full = Image.open(os.path.join(SRC, src)).convert('RGB')
    write(full, f'{stem}.webp', 78)
    composed, bg = card(full)
    write(composed, f'{stem}-card.webp', 80)
    print(f'  ground {bg}')

# Hero cutout: head, shoulders and upper chest, matching the reference's
# framing. Alpha is preserved so the cutout still sits over the wordmark.
port = Image.open(os.path.join(SRC, 'portfolio-image.png')).convert('RGBA')
write(port.crop((90, 0, 970, 800)), 'portrait.webp', 86)

# Square face crop for the 40px footer pill avatar, flattened onto the pill's
# own dark fill so the transparent edge never shows as a light halo.
face = port.crop((358, 0, 778, 420)).resize((160, 160), Image.LANCZOS)
flat = Image.new('RGB', face.size, (22, 22, 22))
flat.paste(face, (0, 0), face)
write(flat, 'avatar.webp', 88)
