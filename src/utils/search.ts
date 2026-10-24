import type { ArkColor, CommandDef, Creature, Item } from '../types'

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Coincidencia por substring sobre cualquiera de los campos indicados. */
export function matches(query: string, ...fields: (string | undefined)[]): boolean {
  const q = normalize(query.trim())
  if (!q) return true
  const haystack = fields.filter(Boolean).map((f) => normalize(f as string))
  // Cada palabra de la busqueda debe aparecer en algun campo ("rex tek").
  return q
    .split(/\s+/)
    .every((word) => haystack.some((f) => f.includes(word)))
}

/** Campos indexados de una criatura: nombre, class name, blueprint, variante, DLC, tags. */
export function creatureFields(c: Creature): string[] {
  return [c.name, c.className, c.blueprintPath, c.group, c.dlc, c.variant, c.movement, ...c.tags]
}

export function itemFields(i: Item): string[] {
  return [
    i.name,
    i.className,
    i.blueprintPath,
    i.category,
    i.itemNumId !== undefined ? String(i.itemNumId) : '',
    ...i.tags,
  ]
}

export function matchesCreature(query: string, c: Creature): boolean {
  return matches(query, ...creatureFields(c))
}

export function matchesItem(query: string, i: Item): boolean {
  return matches(query, ...itemFields(i))
}

export function matchesColor(query: string, c: ArkColor): boolean {
  return matches(query, c.name, c.search, c.hex, String(c.colorId), c.group)
}

/** Ordena poniendo primero los que empiezan por la busqueda. */
export function rankByName<T extends { name: string }>(query: string, list: T[]): T[] {
  const q = normalize(query.trim())
  if (!q) return list
  return [...list].sort((a, b) => {
    const an = normalize(a.name)
    const bn = normalize(b.name)
    const as = an.startsWith(q) ? 0 : an.includes(q) ? 1 : 2
    const bs = bn.startsWith(q) ? 0 : bn.includes(q) ? 1 : 2
    if (as !== bs) return as - bs
    return an.localeCompare(bn)
  })
}

export interface GlobalSearchResults {
  creatures: Creature[]
  items: Item[]
  commands: CommandDef[]
}

export function searchAll(
  query: string,
  creatures: Creature[],
  items: Item[],
  commands: CommandDef[],
): GlobalSearchResults {
  if (!query.trim()) {
    return { creatures: [], items: [], commands: [] }
  }

  return {
    creatures: rankByName(query, creatures.filter((c) => matchesCreature(query, c))),
    items: rankByName(query, items.filter((i) => matchesItem(query, i))),
    commands: commands.filter((c) => matches(query, c.name, c.description, c.syntax)),
  }
}
