"""Draw the full Tīkls no tīkla cage around the whole substation in the real photo (visualisation).

Six masts (wooden pole on a grey concrete stub), woven net on every side and over the roof, AMKA ropes,
guy wires and a gate panel. Run from pitch/:  python scripts/make_cage_photo.py
"""
from PIL import Image, ImageDraw, ImageFilter

SRC = "public/img/before-substation.jpg"
OUT = "public/img/after-substation-cage.jpg"
S = 2  # supersample

base = Image.open(SRC).convert("RGB")
W, H = base.size
lay = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
d = ImageDraw.Draw(lay)


def P(x, y):
    return (x * S, y * S)


# cage corners in photo pixels: ground (g) and top (t); front = nearer the camera
g = {"BL": (40, 872), "BR": (1175, 848), "FR": (1265, 940), "FL": (330, 958)}
t = {"BL": (40, 225), "BR": (1175, 215), "FR": (1265, 205), "FL": (330, 215)}


def lerp(a, b, u):
    return (a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u)


def mesh(q, n_u, n_v, color, width):
    """Fine net on a quadrilateral q = [p00, p10, p11, p01] using two diagonal line families."""
    p00, p10, p11, p01 = q
    pt = lambda u, v: lerp(lerp(p00, p10, u), lerp(p01, p11, u), v)
    k = n_u + n_v
    for i in range(-n_v, n_u + 1):
        a = [pt(max(0, min(1, (i + j) / n_u)), j / n_v) for j in range(0, n_v + 1) if 0 <= (i + j) / n_u <= 1]
        if len(a) > 1:
            d.line([P(*x) for x in a], fill=color, width=width)
        b = [pt(max(0, min(1, (i + n_v - j) / n_u)), j / n_v) for j in range(0, n_v + 1) if 0 <= (i + n_v - j) / n_u <= 1]
        if len(b) > 1:
            d.line([P(*x) for x in b], fill=color, width=width)


back_col, front_col = (40, 44, 48, 120), (25, 28, 31, 175)
# back and left walls, then the roof, then the front and right walls
mesh([g["BL"], g["BR"], t["BR"], t["BL"]], 150, 80, back_col, 1 * S)
mesh([g["FL"], g["BL"], t["BL"], t["FL"]], 40, 80, back_col, 1 * S)
mesh([t["FL"], t["FR"], t["BR"], t["BL"]], 150, 14, (35, 38, 42, 140), 1 * S)
mesh([g["FL"], g["FR"], t["FR"], t["FL"]], 160, 90, front_col, 1 * S)
mesh([g["FR"], g["BR"], t["BR"], t["FR"]], 30, 90, front_col, 1 * S)

# gate panel on the front wall, right part
gq = [lerp(g["FL"], g["FR"], 0.62), lerp(g["FL"], g["FR"], 0.82)]
gt = [(gq[0][0], gq[0][1] - 230), (gq[1][0], gq[1][1] - 230)]
d.polygon([P(*gq[0]), P(*gq[1]), P(*gt[1]), P(*gt[0])], outline=(20, 22, 24, 255), width=3 * S)
d.line([P(*gt[0]), P(*gq[1])], fill=(20, 22, 24, 120), width=1 * S)

# AMKA ropes along every top edge and the bottom of the front walls
for a, b in [("FL", "FR"), ("FR", "BR"), ("BR", "BL"), ("BL", "FL")]:
    d.line([P(*t[a]), P(*t[b])], fill=(12, 12, 13, 255), width=4 * S)
d.line([P(*lerp(t["FL"], t["BL"], 0.5)), P(*lerp(t["FR"], t["BR"], 0.5))], fill=(12, 12, 13, 230), width=3 * S)
for a, b in [("FL", "FR"), ("FR", "BR")]:
    d.line([P(*g[a]), P(*g[b])], fill=(12, 12, 13, 230), width=3 * S)

# guy wires from the corner tops out to ground anchors
anchors = {"FL": (210, 1030), "FR": (1420, 1000), "BR": (1330, 860), "BL": (0, 900)}
for k, a in anchors.items():
    d.line([P(*t[k]), P(*a)], fill=(30, 32, 34, 220), width=2 * S)
    d.rectangle([P(a[0] - 7, a[1] - 4), P(a[0] + 7, a[1] + 4)], fill=(90, 92, 94, 255))

# six masts: wooden pole on a grey concrete stub, two steel bands
masts = [g["BL"], lerp(g["BL"], g["BR"], 0.5), g["BR"], g["FL"], lerp(g["FL"], g["FR"], 0.5), g["FR"]]
tops = [t["BL"], lerp(t["BL"], t["BR"], 0.5), t["BR"], t["FL"], lerp(t["FL"], t["FR"], 0.5), t["FR"]]
for i, (b, tp) in enumerate(zip(masts, tops)):
    near = i >= 3
    w = 9 if near else 6
    stub_top = (b[0], b[1] - (110 if near else 80))
    d.rectangle([P(tp[0] - w * 0.8, tp[1] - 8), P(b[0] + w * 0.8, stub_top[1] + 20)], fill=(84, 62, 42, 255))
    d.rectangle([P(tp[0] - w * 0.8, tp[1] - 8), P(tp[0] - w * 0.2, stub_top[1] + 20)], fill=(110, 84, 58, 255))
    d.rectangle([P(b[0] - w, stub_top[1]), P(b[0] + w, b[1])], fill=(146, 149, 151, 255))
    d.rectangle([P(b[0] - w, stub_top[1]), P(b[0] - w * 0.3, b[1])], fill=(172, 175, 177, 255))
    for yy in (stub_top[1] + 10, stub_top[1] + 40):
        d.rectangle([P(b[0] - w - 2, yy - 3), P(b[0] + w + 2, yy + 3)], fill=(55, 58, 62, 255))

# soft contact shadow under the front walls
sh = Image.new("RGBA", lay.size, (0, 0, 0, 0))
ImageDraw.Draw(sh).polygon([P(*g["FL"]), P(*g["FR"]), P(g["FR"][0] + 30, g["FR"][1] + 18), P(g["FL"][0] + 30, g["FL"][1] + 18)], fill=(0, 0, 0, 90))
sh = sh.filter(ImageFilter.GaussianBlur(8 * S))

over = Image.alpha_composite(sh, lay).resize((W, H), Image.LANCZOS)
out = Image.alpha_composite(base.convert("RGBA"), over).convert("RGB")
out.save(OUT, quality=92)
print(OUT, out.size)
