"""Genera src/data/colors.json.

Fuente: ARK Official Community Wiki - Color IDs (https://ark.wiki.gg/wiki/Color_IDs)
Solo se incluyen los IDs validos en ARK: Survival Evolved:
  - 1..100  -> colores base del juego
  - 201..226 -> tintes (dyes) de ASE
  - 0 -> valor especial "sin color" (la region no se actualiza)
Los IDs 128..254 que aparecen en el wiki pertenecen a ARK: Survival Ascended y
NO se incluyen aqui.
"""
import json, re, sys, pathlib

BASE = """1 Red FF0000
2 Blue 0000FF
3 Green 00FF00
4 Yellow FFFF00
5 Cyan 00FFFF
6 Magenta FF00FF
7 Light Green C0FFBA
8 Light Grey C8CACA
9 Light Brown 786759
10 Light Orange FFB46C
11 Light Yellow FFFA8A
12 Light Red FF756C
13 Dark Grey 7B7B7B
14 Black 3B3B3B
15 Brown 593A2A
16 Dark Green 224900
17 Dark Red 812118
18 White FFFFFF
19 Dino Light Red FFA8A8
20 Dino Dark Red 592B2B
21 Dino Light Orange FFB694
22 Dino Dark Orange 88532F
23 Dino Light Yellow CACAA0
24 Dino Dark Yellow 94946C
25 Dino Light Green E0FFE0
26 Dino Medium Green 799479
27 Dino Dark Green 224122
28 Dino Light Blue D9E0FF
29 Dino Dark Blue 394263
30 Dino Light Purple E4D9FF
31 Dino Dark Purple 403459
32 Dino Light Brown FFE0BA
33 Dino Medium Brown 948575
34 Dino Dark Brown 594E41
35 Dino Darker Grey 595959
36 Dino Albino FFFFFF
37 BigFoot0 B79683
38 BigFoot4 EADAD5
39 BigFoot5 D0A794
40 WolfFur C3B39F
41 DarkWolfFur 887666
42 DragonBase0 A0664B
43 DragonBase1 CB7956
44 DragonFire BC4F00
45 DragonGreen0 79846C
46 DragonGreen1 909C79
47 DragonGreen2 A5A48B
48 DragonGreen3 74939C
49 WyvernPurple0 787496
50 WyvernPurple1 B0A2C0
51 WyvernBlue0 6281A7
52 WyvernBlue1 485C75
53 Dino Medium Blue 5FA4EA
54 Dino Deep Blue 4568D4
55 NearWhite EDEDED
56 NearBlack 515151
57 DarkTurquoise 184546
58 MediumTurquoise 007060
59 Turquoise 00C5AB
60 GreenSlate 40594C
61 Sage 3E4F40
62 DarkWarmGray 3B3938
63 MediumWarmGray 585554
64 LightWarmGray 9B9290
65 DarkCement 525B56
66 LightCement 8AA196
67 LightPink E8B0FF
68 DeepPink FF119A
69 DarkViolet 730046
70 DarkMagenta B70042
71 BurntSienna 7E331E
72 MediumAutumn A93000
73 Vermillion EF3100
74 Coral FF5834
75 Orange FF7F00
76 Peach FFA73A
77 LightAutumn AE7000
78 Mustard 949427
79 ActualBlack 171717
80 MidnightBlue 191D36
81 DarkBlue 152B3A
82 BlackSands 302531
83 LemonLime A8FF44
84 Mint 38E985
85 Jade 008840
86 PineGreen 0F552E
87 SpruceGreen 005B45
88 LeafGreen 5B9725
89 DarkLavender 5E275F
90 MediumLavender 853587
91 Lavender BD77BE
92 DarkTeal 0E404A
93 MediumTeal 105563
94 Teal 14849C
95 PowderBlue 82A7FF
96 Glacial ACEAFF
97 Cammo 505118
98 DryMoss 766E3F
99 Custard C0BD5E
100 Cream F4FFC0"""

DYES = """201 Black Coloring 1F1F1F
202 Blue Coloring 0000FF
203 Brown Coloring 756147
204 Cyan Coloring 00FFFF
205 Forest Coloring 006C00
206 Green Coloring 00FF00
207 Purple Coloring (mutation only) 6C00BA
208 Orange Coloring FF8800
209 Parchement Coloring FFFFBA
210 Pink Coloring FF7BE1
211 Purple Coloring 7B00E0
212 Red Coloring FF0000
213 Royalty Coloring 7B00A8
214 Silver Coloring E0E0E0
215 Sky Coloring BAD4FF
216 Tan Coloring FFEDB2
217 Tangerine Coloring AD652C
218 White Coloring FEFEFE
219 Yellow Coloring FFFF00
220 Magenta Coloring E71FD9
221 Brick Coloring 94341F
222 Cantaloupe Coloring FF9A00
223 Mud Coloring 473B2B
224 Navy Coloring 34346C
225 Olive Coloring BABA59
226 Slate Coloring 595959"""


def split_words(name):
    """'DarkWolfFur' -> 'dark wolf fur' para que la busqueda encuentre 'wolf'."""
    spaced = re.sub(r'(?<=[a-z])(?=[A-Z])|(?<=[A-Za-z])(?=\d)', ' ', name)
    return spaced.lower()


def slugify(name):
    return re.sub(r'[^a-z0-9]+', '-', split_words(name)).strip('-')


def parse(block, group):
    out = []
    for line in block.strip().splitlines():
        parts = line.split(' ')
        cid = int(parts[0])
        hexv = parts[-1]
        name = ' '.join(parts[1:-1])
        out.append({
            'id': slugify(name) + ('' if group == 'Base' else '-dye'),
            'colorId': cid,
            'name': name,
            'hex': '#' + hexv,
            'group': group,
            'search': f'{split_words(name)} {cid}',
        })
    return out


colors = [{
    'id': 'unset',
    'colorId': 0,
    'name': 'Unset (no color)',
    'hex': '#000000',
    'group': 'Special',
    'search': 'unset none default 0',
    'note': 'ID 0 indica que la region no se actualiza. Solo tiene efecto tras meter y sacar a la criatura de una criopod.',
}]
colors += parse(BASE, 'Base')
colors += parse(DYES, 'Dye')

errors = []
seen = set()
for c in colors:
    if c['colorId'] in seen:
        errors.append(f'duplicate color id {c["colorId"]}')
    seen.add(c['colorId'])
    if not re.fullmatch(r'#[0-9A-F]{6}', c['hex']):
        errors.append(f'bad hex {c}')
    if not c['name']:
        errors.append('empty name')
ids = [c['id'] for c in colors]
if len(ids) != len(set(ids)):
    errors.append('duplicate slug id')
if errors:
    print('\n'.join(errors)); sys.exit(1)

pathlib.Path(sys.argv[1]).write_text(json.dumps(colors, indent=2, ensure_ascii=False) + '\n')
print(len(colors), 'colors written')
