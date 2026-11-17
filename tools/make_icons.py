from pathlib import Path
from PIL import Image, ImageDraw

size = 1024
background = (11, 11, 13, 255)
accent = (31, 174, 106, 255)
neon = (125, 255, 196, 255)

icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(icon)
draw.rounded_rectangle((32, 32, size - 32, size - 32), radius=220, fill=background, outline=accent, width=40)
draw.polygon([(390, 300), (390, 724), (740, 512)], fill=neon)
draw.line([(260, 760), (764, 256)], fill=background, width=110)
draw.line([(260, 760), (764, 256)], fill=accent, width=60)

icons_folder = Path(__file__).resolve().parent.parent / 'extension' / 'icons'
for icon_size in (16, 32, 48, 128):
    icon.resize((icon_size, icon_size), Image.LANCZOS).save(icons_folder / f'{icon_size}.png')
