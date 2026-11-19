"""Zet de ploegfoto's in het teamfoto-sjabloon voor het tv-scherm in de kantine.

Leest elke `image: "/images/teams/..."` uit src/lib/teams.ts, plaatst die foto
in het grijze vlak van het sjabloon (onder het schild en de banner) en schrijft
het resultaat naar public/images/tv/ploegfoto/<naam>.jpg. De naam is de
bestandsnaam van de foto in kleine letters, spaties vervangen door streepjes;
src/app/uitslagen-sponsoring/tv/route.ts gebruikt dezelfde regel.

Opnieuw draaien na een nieuwe ploegfoto of een nieuw sjabloon:
    python scripts/tv-ploegfotos.py
"""

import os
import re
import sys

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

HIER = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HIER)
SJABLOON = os.path.join(REPO, "public", "images", "tv", "teamfoto-sjabloon.png")
DOEL = os.path.join(REPO, "public", "images", "tv", "ploegfoto")

# Het grijze vlak binnen de witte rand van het sjabloon (1920 x 1080, sinds 19/11/2026).
VAK = (125, 197, 1797, 947)
# Het vak is veel breder (2,2:1) dan een ploegfoto (3:2). Volledig vullen zou
# hoofden of voeten wegsnijden, dus de foto mag hooguit zoveel bijgesneden
# worden; de ruimte links en rechts krijgt een wazige, donkere versie van
# dezelfde foto.
MAX_BIJSNIJDEN = 0.08
# Waar het bijsnijden gebeurt: 0 = alles onderaan eraf, 0.5 = gelijk verdeeld.
VERTICAAL = 0.3


def naam(pad):
    basis = os.path.splitext(os.path.basename(pad))[0]
    return re.sub(r"\s+", "-", basis.strip()).lower()


def gat(sjabloon):
    """Masker van het grijze vlak: wit = daar komt de foto."""
    rgb = sjabloon.convert("RGB")
    x0, y0, x1, y1 = VAK
    masker = Image.new("L", sjabloon.size, 0)
    px = rgb.load()
    m = masker.load()
    for y in range(y0, y1):
        for x in range(x0, x1):
            r, g, b = px[x, y]
            hoog, laag = max(r, g, b), min(r, g, b)
            # Grijs: weinig kleur en niet zo wit als het schild of de rand.
            if hoog - laag < 14 and 185 <= hoog <= 247:
                m[x, y] = 255
    # Enkel het samenhangende vlak vanuit het midden houden, zodat losse
    # grijze pixels in het schild of de banner niet meedoen.
    ImageDraw.floodfill(masker, ((x0 + x1) // 2, (y0 + y1) // 2), 128)
    return masker.point(lambda v: 255 if v == 128 else 0)


def bedek(foto, breedte, hoogte, verticaal=0.5):
    """Foto passend uitsnijden (zoals object-fit: cover)."""
    fb, fh = foto.size
    schaal = max(breedte / fb, hoogte / fh)
    nb, nh = round(fb * schaal), round(fh * schaal)
    foto = foto.resize((nb, nh), Image.LANCZOS)
    links = (nb - breedte) // 2
    boven = round((nh - hoogte) * verticaal)
    return foto.crop((links, boven, links + breedte, boven + hoogte))


def vul(foto, breedte, hoogte):
    """Scherpe foto in het midden, wazige versie errond."""
    achter = bedek(foto, breedte, hoogte)
    achter = achter.resize((breedte // 8, hoogte // 8), Image.LANCZOS).filter(ImageFilter.GaussianBlur(4))
    achter = achter.resize((breedte, hoogte), Image.LANCZOS)
    achter = ImageEnhance.Brightness(achter).enhance(0.45)

    fb, fh = foto.size
    # Hoogte van de scherpe foto: het vak, plus het stuk dat eraf mag.
    sh = round(hoogte / (1 - MAX_BIJSNIJDEN))
    sb = round(fb * sh / fh)
    if sb >= breedte:
        return bedek(foto, breedte, hoogte, VERTICAAL)
    scherp = foto.resize((sb, sh), Image.LANCZOS)
    boven = round((sh - hoogte) * VERTICAAL)
    scherp = scherp.crop((0, boven, sb, boven + hoogte))
    achter.paste(scherp, ((breedte - sb) // 2, 0))
    return achter


def main():
    with open(os.path.join(REPO, "src", "lib", "teams.ts"), encoding="utf-8") as f:
        paden = sorted(set(re.findall(r'image:\s*"(/images/teams/[^"]+)"', f.read())))
    if not paden:
        sys.exit("geen ploegfoto's gevonden in teams.ts")

    sjabloon = Image.open(SJABLOON).convert("RGBA")
    masker = gat(sjabloon)
    x0, y0, x1, y1 = VAK
    os.makedirs(DOEL, exist_ok=True)

    for pad in paden:
        bron = os.path.join(REPO, "public", pad.lstrip("/"))
        foto = Image.open(bron).convert("RGB")
        onder = Image.new("RGB", sjabloon.size, (0, 0, 0))
        onder.paste(vul(foto, x1 - x0, y1 - y0), (x0, y0))
        uit = Image.composite(onder, sjabloon.convert("RGB"), masker)
        doel = os.path.join(DOEL, naam(pad) + ".jpg")
        uit.save(doel, "JPEG", quality=84, optimize=True, progressive=True)
        print(f"{pad} -> {os.path.relpath(doel, REPO)} ({os.path.getsize(doel) // 1024} kB)")


if __name__ == "__main__":
    main()
