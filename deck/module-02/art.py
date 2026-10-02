import random, math
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import numpy as np

# ---- logo: un-blend navy JPEG background into transparent PNG ----
src = Image.open('../images/1.jpg').convert('RGB')
bx0, by0, bx1, by1 = 132, 59, 1391, 407
pad = 8
crop = src.crop((bx0-pad, by0-pad, bx1+pad, by1+pad))
a = np.asarray(crop).astype(np.float32)
bg = np.array([26, 32, 44], np.float32)
alpha = np.max((a - bg) / (255 - bg), axis=2).clip(0, 1)
alpha[alpha < 0.06] = 0
safe = np.where(alpha > 0, alpha, 1)[..., None]
fg = (bg + (a - bg) / safe).clip(0, 255)
out = np.dstack([fg, alpha * 255]).astype(np.uint8)
Image.fromarray(out, 'RGBA').save('assets/logo.png')
print('logo', crop.size)

# ---- cover artwork: circuit traces with cyan / blue glow ----
def cover(seed, path, W=3840, H=2160):
    rnd = random.Random(seed)
    base = Image.new('RGB', (W, H), (26, 33, 43))
    # soft radial glows
    glow = Image.new('RGB', (W, H), (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for cx, cy, r, col in [(W*0.86, H*0.18, 900, (12, 52, 82)), (W*0.95, H*0.9, 700, (8, 46, 64)), (W*0.04, H*1.08, 560, (8, 36, 56))]:
        gd.ellipse([cx-r, cy-r, cx+r, cy+r], fill=col)
    glow = glow.filter(ImageFilter.GaussianBlur(380))
    base = ImageChops.add(base, glow)

    lines = Image.new('RGB', (W, H), (0, 0, 0))
    ld = ImageDraw.Draw(lines)
    G = 64
    def density(x, y):
        # keep the left/centre text zone quiet
        nx, ny = x / W, y / H
        d = max(0.0, (nx - 0.42) / 0.58) ** 1.2
        d = max(d, max(0.0, (ny - 0.86) / 0.14) * 0.6)
        return d
    traces = []
    for _ in range(120):
        x = rnd.randrange(0, W // G) * G
        y = rnd.randrange(0, H // G) * G
        if rnd.random() > density(x, y):
            continue
        pts = [(x, y)]
        dx, dy = rnd.choice([(1, 0), (-1, 0), (0, 1), (0, -1)])
        for _ in range(rnd.randint(3, 7)):
            n = rnd.randint(2, 7)
            x += dx * n * G; y += dy * n * G
            pts.append((x, y))
            # 45-degree turn then orthogonal
            if rnd.random() < 0.6:
                if dx == 0:
                    ndx = rnd.choice([1, -1]); ndy = dy
                else:
                    ndy = rnd.choice([1, -1]); ndx = dx
                k = rnd.randint(1, 2)
                x += ndx * k * G; y += ndy * k * G
                pts.append((x, y))
                dx, dy = (ndx, 0) if dx == 0 else (0, ndy)
        traces.append(pts)
    for pts in traces:
        bright = rnd.random()
        col = (56, 189, 248) if bright > 0.7 else (14, 116, 144)
        w = 4 if bright > 0.7 else 3
        ld.line(pts, fill=col, width=w, joint='curve')
        for (px, py) in (pts[0], pts[-1]):
            r = 10
            ld.ellipse([px-r, py-r, px+r, py+r], outline=col, width=4)
        for (px, py) in pts[1:-1]:
            if rnd.random() < 0.25:
                ld.ellipse([px-6, py-6, px+6, py+6], fill=col)
    # fade traces by density mask so they melt into navy
    mask = Image.new('L', (W, H))
    mp = mask.load()
    small = Image.new('L', (96, 54))
    sp = small.load()
    for j in range(54):
        for i in range(96):
            sp[i, j] = int(255 * min(1, density(i / 96 * W, j / 54 * H) * 1.25))
    mask = small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(60))
    lines = Image.composite(lines, Image.new('RGB', (W, H)), mask)
    halo = lines.filter(ImageFilter.GaussianBlur(14))
    dim = Image.eval(lines, lambda v: int(v * 0.42))
    base = ImageChops.add(base, Image.eval(halo, lambda v: int(v * 0.6)))
    base = ImageChops.add(base, dim)
    base.resize((1920 * 2 // 2 * 1, 1080), Image.LANCZOS) if False else None
    base.save(path, quality=92)

cover(7, 'assets/cover_a.jpg')
cover(21, 'assets/cover_b.jpg')
cover(42, 'assets/cover_c.jpg')
cover(77, 'assets/cover_d.jpg')
cover(99, 'assets/cover_e.jpg')
print('done')
