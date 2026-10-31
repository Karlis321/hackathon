"""Draw the Matrica shield (concrete posts, cable grid, crushed-concrete wall) over the real substation photo.

The result is a concept visualisation, not a photo of a built shield. Run from pitch/:
    python scripts/make_after.py
"""
import random
from PIL import Image, ImageDraw, ImageFilter

SRC = "public/img/before-substation.jpg"
OUT = "public/img/after-substation-shield.jpg"
S = 2  # draw at 2x, then downsample for smooth lines

base = Image.open(SRC).convert("RGB")
W, H = base.size
layer = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
d = ImageDraw.Draw(layer)
random.seed(7)

# screen in front of both transformers, about 2 m out on the concrete apron
x0, x1 = 420 * S, 1170 * S
top, ground = 585 * S, 940 * S
wall_top = 885 * S

# crushed-concrete wall at the base
d.rectangle([x0 - 10 * S, wall_top, x1 + 10 * S, ground], fill=(122, 126, 128, 255))
for _ in range(1400):
    cx = random.randint(x0, x1); cy = random.randint(wall_top + 4 * S, ground - 4 * S); r = random.randint(3, 8) * S // 2
    g = random.randint(95, 165)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(g, g, g + 3, 255))
d.line([x0 - 10 * S, wall_top, x1 + 10 * S, wall_top], fill=(160, 164, 166, 255), width=2 * S)

# cable grid: whole insulated cables, laid straight, ~10 cm spacing
step = 6 * S
cable = (24, 26, 28, 205)
for x in range(x0, x1 + 1, step):
    d.line([x, top + 6 * S, x, wall_top], fill=cable, width=int(1.5 * S))
for y in range(top + 6 * S, wall_top, step):
    d.line([x0, y, x1, y], fill=cable, width=int(1.5 * S))
# thick cables across the lower part, in front of the radiators
for y in range(790 * S, wall_top - 4 * S, 15 * S):
    d.line([x0, y, x1, y], fill=(18, 19, 21, 240), width=5 * S)
# ties at crossings (every other node)
for x in range(x0, x1 + 1, step * 2):
    for y in range(top + 6 * S, wall_top, step * 2):
        d.ellipse([x - 2 * S, y - 2 * S, x + 2 * S, y + 2 * S], fill=(70, 74, 78, 230))

# AMKA ropes, top and bottom
for y in (top + 4 * S, wall_top - 2 * S):
    d.line([x0 - 14 * S, y, x1 + 14 * S, y], fill=(12, 12, 13, 255), width=6 * S)
    d.line([x0 - 14 * S, y - 2 * S, x1 + 14 * S, y - 2 * S], fill=(90, 92, 95, 160), width=1 * S)

# reused concrete posts
for px in [x0, x0 + (x1 - x0) // 4, x0 + (x1 - x0) // 2, x0 + 3 * (x1 - x0) // 4, x1]:
    w = 15 * S
    d.rectangle([px - w, top - 30 * S, px + w, ground], fill=(176, 179, 180, 255))
    d.rectangle([px - w, top - 30 * S, px - w + 7 * S, ground], fill=(205, 207, 208, 255))   # lit side
    d.rectangle([px + w - 8 * S, top - 30 * S, px + w, ground], fill=(132, 135, 137, 255))   # shaded side
    d.rectangle([px - w - 2 * S, top - 34 * S, px + w + 2 * S, top - 26 * S], fill=(150, 153, 155, 255))  # cap

# soft contact shadow on the ground
shadow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
ImageDraw.Draw(shadow).rectangle([x0 - 20 * S, ground - 4 * S, x1 + 40 * S, ground + 14 * S], fill=(0, 0, 0, 110))
shadow = shadow.filter(ImageFilter.GaussianBlur(10 * S))

overlay = Image.alpha_composite(shadow, layer).resize((W, H), Image.LANCZOS)
out = Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")
out.save(OUT, quality=92)
print(OUT, out.size)
