"""Genera src/data/items.json a partir de items.txt.

Plantillas de ruta (todas dentro de ARK: Survival Evolved):
  RES  -> /Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_X
  CON  -> /Game/PrimalEarth/CoreBlueprints/Items/Consumables/PrimalItemConsumable_X
  SEED -> /Game/PrimalEarth/CoreBlueprints/Items/Consumables/Seeds/PrimalItemConsumable_Seed_X
  DYE  -> /Game/PrimalEarth/CoreBlueprints/Items/PrimalItemDye_X
  ART  -> /Game/PrimalEarth/CoreBlueprints/Items/Artifacts/PrimalItemArtifact_NN
  SAD  -> /Game/PrimalEarth/CoreBlueprints/Items/Armor/Saddles/PrimalItemArmor_X
  ARM  -> /Game/PrimalEarth/CoreBlueprints/Items/Armor/<set>/PrimalItemArmor_X
  WPN  -> /Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponX
  AMMO -> /Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItemAmmo_X
  STR  -> /Game/PrimalEarth/CoreBlueprints/Items/Structures/<tier>/PrimalItemStructure_X
  EGG  -> /Game/PrimalEarth/Test/PrimalItemConsumable_Egg_X
  RAW  -> ruta completa

`verified: true` = la carpeta de la ruta esta confirmada contra el ARK Official
Community Wiki (Item IDs / paginas de objeto) en la revision consultada.
`verified: false` = la ruta sigue el patron estandar del juego pero no pudo
confirmarse contra el wiki al generar este archivo: conviene comprobarla en el
juego antes de confiar en ella.
"""
import json, re, sys, pathlib

CB = '/Game/PrimalEarth/CoreBlueprints/'

TEMPLATES = {
    'RES':  (CB + 'Resources/PrimalItemResource_{x}', 'Resources', True),
    'CON':  (CB + 'Items/Consumables/PrimalItemConsumable_{x}', 'Consumables', True),
    'SEED': (CB + 'Items/Consumables/Seeds/PrimalItemConsumable_Seed_{x}', 'Seeds', True),
    'DYE':  (CB + 'Items/PrimalItemDye_{x}', 'Dye', True),
    'ART':  (CB + 'Items/Artifacts/PrimalItemArtifact_{x}', 'Artifacts', True),
    'SAD':  (CB + 'Items/Armor/Saddles/PrimalItemArmor_{x}', 'Saddles', True),
    'ARM':  (CB + 'Items/Armor/{x}', 'Armor', False),
    'WPN':  (CB + 'Weapons/PrimalItem_Weapon{x}', 'Weapons', True),
    'AMMO': (CB + 'Weapons/PrimalItemAmmo_{x}', 'Ammo', False),
    'STR':  (CB + 'Items/Structures/{x}', 'Structures', False),
    'EGG':  ('/Game/PrimalEarth/Test/PrimalItemConsumable_Egg_{x}', 'Eggs', True),
}

SECTION_CATEGORY = {
    'Resources': 'Resources', 'Consumables': 'Consumables', 'Seeds': 'Consumables',
    'Weapons': 'Weapons', 'Tools': 'Tools', 'Ammo': 'Ammo', 'Armor': 'Armor',
    'Saddles': 'Saddles', 'Artifacts': 'Artifacts', 'Structures': 'Structures',
    'Dye': 'Cosmetics', 'Eggs': 'Consumables',
}


def slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def expand(spec):
    if spec.startswith('RAW:'):
        base = spec[4:]
        return base, True
    pre, rest = spec.split(':', 1)
    tpl, _cat, verified = TEMPLATES[pre]
    if pre == 'ARM':
        s, cls = rest.split('/')
        return CB + f'Items/Armor/{s}/PrimalItemArmor_{cls}', verified
    if pre == 'STR':
        tier, cls = rest.split('/')
        return CB + f'Items/Structures/{tier}/PrimalItemStructure_{cls}', verified
    return tpl.format(x=rest), verified


def make(name, spec, category, stack, can_bp, num, dlc='ARK: Survival Evolved'):
    base, verified = expand(spec)
    asset = base.rsplit('/', 1)[1]
    item = {
        'id': slug(name),
        'name': name,
        'category': category,
        'className': asset + '_C',
        'blueprintPath': f"Blueprint'{base}.{asset}'",
        'stackSize': stack,
        'canBeBlueprint': bool(can_bp),
        'verified': verified,
        'tags': sorted({category, asset}),
    }
    if num:
        item['itemNumId'] = int(num)
    return item


def main(src, dst):
    items = []
    section = 'Resources'
    for raw in pathlib.Path(src).read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith('#'):
            continue
        if line.startswith('>'):
            section = line[1:].strip()
            continue
        parts = line.split('|')
        if len(parts) != 5:
            sys.exit(f'bad line: {line}')
        name, spec, stack, can_bp, num = [p.strip() for p in parts]
        cat = SECTION_CATEGORY[section]
        items.append(make(name, spec, cat, int(stack), can_bp == '1', num))
        # Todos los huevos de criaturas criables tienen version fertilizada:
        # se anade "_Fertilized" dos veces a la ruta (documentado en el wiki).
        if spec.startswith('EGG:'):
            fert = make('Fertilized ' + name, spec + '_Fertilized', cat, int(stack), False, '')
            items.append(fert)

    errors, seen_id, seen_bp = [], set(), {}
    for i in items:
        if not i['name'] or not i['blueprintPath'] or not i['className']:
            errors.append(f'empty field: {i}')
        if not i['blueprintPath'].startswith("Blueprint'/Game/"):
            errors.append(f'bad path: {i["name"]}')
        if '/Game/ASA/' in i['blueprintPath']:
            errors.append(f'ASA item: {i["name"]}')
        if i['id'] in seen_id:
            errors.append(f'duplicate id: {i["id"]}')
        if i['blueprintPath'] in seen_bp:
            errors.append(f'duplicate path: {i["name"]} == {seen_bp[i["blueprintPath"]]}')
        seen_id.add(i['id'])
        seen_bp[i['blueprintPath']] = i['name']
    nums = [i['itemNumId'] for i in items if 'itemNumId' in i]
    if len(nums) != len(set(nums)):
        errors.append('duplicate itemNumId')
    if errors:
        print('\n'.join(errors)); sys.exit(1)

    items.sort(key=lambda i: i['name'].lower())
    pathlib.Path(dst).write_text(json.dumps(items, indent=2, ensure_ascii=False) + '\n')
    from collections import Counter
    print(len(items), 'items written')
    print('by category:', dict(Counter(i['category'] for i in items)))
    print('verified:', sum(1 for i in items if i['verified']), '/ with numeric id:', len(nums))


main(sys.argv[1], sys.argv[2])
