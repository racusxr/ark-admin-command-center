import json, re, sys, pathlib

PREFIX = {
    'PE': '/Game/PrimalEarth/Dinos/',
    'SE': '/Game/ScorchedEarth/Dinos/',
    'AB': '/Game/Aberration/Dinos/',
    'EX': '/Game/Extinction/Dinos/',
    'GEN': '/Game/Genesis/Dinos/',
    'GEN2': '/Game/Genesis2/Dinos/',
    'LI': '/Game/LostIsland/Dinos/',
    'FJ': '/Game/Fjordur/Dinos/',
}

def slug(name):
    s = name.lower()
    s = s.replace("'", '')
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s

def expand(spec):
    """Returns (blueprintPath, className)."""
    override = None
    if '#' in spec:
        spec, override = spec.split('#', 1)
    if spec.startswith('FULL:'):
        path = spec[5:]
    elif spec.startswith('RAW:'):
        asset = spec[4:].rsplit('/', 1)[1]
        path = f'{spec[4:]}.{asset}'
    else:
        pre, rest = spec.split(':', 1)
        asset = rest.rsplit('/', 1)[-1]
        path = f'{PREFIX[pre]}{rest}.{asset}'
    obj = path.rsplit('.', 1)[1]
    cls = override if override else obj + '_C'
    return f"Blueprint'{path}'", cls

def parse(files):
    out = []
    dlc = 'The Island'
    for f in files:
        for raw in pathlib.Path(f).read_text().splitlines():
            line = raw.strip()
            if not line:
                continue
            if line.startswith('>'):
                dlc = line[1:].strip()
                continue
            parts = line.split('|')
            if len(parts) != 5:
                sys.exit(f'Bad line ({len(parts)} fields): {line}')
            name, spec, group, variant, movement = [p.strip() for p in parts]
            bp, cls = expand(spec)
            asset = bp.rsplit('.', 1)[1].rstrip("'")
            tags = [group, dlc, variant, movement, asset]
            out.append({
                'id': slug(name),
                'name': name,
                'className': cls,
                'blueprintPath': bp,
                'group': group,
                'dlc': dlc,
                'variant': variant,
                'movement': movement,
                'tags': sorted({t for t in tags if t}),
            })
    return out

data = parse(sys.argv[1:-1])

# --- validation -------------------------------------------------------------
errors = []
seen_id, seen_bp = {}, {}
for c in data:
    if not c['name'] or not c['blueprintPath'] or not c['className']:
        errors.append(f'empty field: {c}')
    if not c['blueprintPath'].startswith("Blueprint'/Game/"):
        errors.append(f'bad blueprint: {c["name"]}')
    if '/Game/ASA/' in c['blueprintPath']:
        errors.append(f'ASA content is not ASE: {c["name"]}')
    if c['id'] in seen_id:
        errors.append(f'duplicate id: {c["id"]}')
    if c['blueprintPath'] in seen_bp:
        errors.append(f'duplicate blueprint: {c["name"]} == {seen_bp[c["blueprintPath"]]}')
    seen_id[c['id']] = True
    seen_bp[c['blueprintPath']] = c['name']

if errors:
    print('\n'.join(errors))
    sys.exit(1)

data.sort(key=lambda c: c['name'].lower())
pathlib.Path(sys.argv[-1]).write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
print(f'{len(data)} creatures written')
from collections import Counter
print('by dlc:', dict(Counter(c['dlc'] for c in data)))
print('by variant:', dict(Counter(c['variant'] for c in data)))
