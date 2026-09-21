import type { TFn } from '../i18n/I18nContext'
import type {
  CheatPrefix,
  CommandDef,
  Creature,
  Item,
  SpawnCommandType,
} from '../types'

/* ---------------------------------------------------------------------------
 * SpawnDino / GMSummon / Summon
 * ------------------------------------------------------------------------ */

export interface SpawnOptions {
  creature: Creature
  level: number
  quantity: number
  tamed: boolean
  commandType: SpawnCommandType
  prefix?: CheatPrefix
  spawnDistance?: number
  yOffset?: number
  zOffset?: number
}

export function buildSpawnCommand(opts: SpawnOptions): string {
  const { creature, level, commandType } = opts
  const p = opts.prefix ?? 'admincheat'
  const safeLevel = Math.max(1, Math.round(level) || 1)

  if (commandType === 'Summon') {
    return `${p} Summon ${creature.className}`
  }
  if (commandType === 'GMSummon') {
    return `${p} GMSummon "${creature.className}" ${safeLevel}`
  }

  const x = opts.spawnDistance ?? 500
  const y = opts.yOffset ?? 0
  const z = opts.zOffset ?? 0
  return `${p} SpawnDino "${creature.blueprintPath}" ${x} ${y} ${z} ${safeLevel}`
}

/** SpawnDino/GMSummon crean una sola criatura: para N se repiten N comandos. */
export function buildSpawnCommands(opts: SpawnOptions): string[] {
  const qty = Math.max(1, Math.round(opts.quantity) || 1)
  return Array.from({ length: qty }, (_, i) =>
    buildSpawnCommand({ ...opts, spawnDistance: (opts.spawnDistance ?? 500) + i * 150 }),
  )
}

/* ---------------------------------------------------------------------------
 * SpawnExactDino
 *
 * Sintaxis real (ARK Official Community Wiki - Console commands):
 *
 *   SpawnExactDino <DinoBlueprintPath> <SaddleBlueprintPath> <SaddleQuality>
 *                  <BaseLevel> <ExtraLevels> <BaseStats> <AddedStats>
 *                  <DinoName> <Cloned> <Neutered> <TamedOn> <UploadedFrom>
 *                  <ImprinterName> <ImprinterPlayerID> <ImprintQuality>
 *                  <Colors> <DinoID> <Exp> <spawnDistance> <YOffset> <ZOffset>
 *
 * Son 21 parametros en ese orden exacto. Notas del wiki que respetamos:
 *  - BaseLevel deberia ser la suma de BaseStats + 1.
 *  - ExtraLevels deberia ser la suma de AddedStats.
 *  - BaseStats/AddedStats son 8 valores: Health, Stamina, Oxygen, Food, Weight,
 *    Melee Damage, Movement Speed, Crafting Skill.
 *  - Colors es la lista de IDs de color por region (ARK usa 6 regiones: 0-5).
 *  - Hay que meter y sacar a la criatura de una criopod para ver stats y
 *    colores correctos.
 * ------------------------------------------------------------------------ */

export const STAT_ORDER = [
  'Health',
  'Stamina',
  'Oxygen',
  'Food',
  'Weight',
  'Melee Damage',
  'Movement Speed',
  'Crafting Skill',
] as const

/** ARK tiene 6 regiones de color por criatura (0 a 5). */
export const COLOR_REGION_COUNT = 6

export interface SpawnExactDinoOptions {
  creature: Creature
  /** Ruta de blueprint de la silla; "" = sin silla. */
  saddleBlueprintPath?: string
  saddleQuality?: number
  baseLevel: number
  extraLevels?: number
  /** 8 enteros (orden STAT_ORDER). */
  baseStats: number[]
  /** 8 enteros (orden STAT_ORDER). */
  addedStats?: number[]
  dinoName?: string
  cloned?: boolean
  neutered?: boolean
  tamedOn?: string
  uploadedFrom?: string
  imprinterName?: string
  imprinterPlayerId?: number
  /** 0 a 1 (0.5 = 50% de imprint). */
  imprintQuality?: number
  /** IDs de color por region, 6 valores. */
  colors: number[]
  dinoId?: number
  exp?: number
  spawnDistance?: number
  yOffset?: number
  zOffset?: number
  prefix?: CheatPrefix
}

function quoted(value: string): string {
  // ARK no admite comillas dobles dentro del argumento: se limpian.
  return `"${(value ?? '').replace(/"/g, '')}"`
}

function intOr(value: number | undefined, fallback: number): number {
  return Number.isFinite(value) ? Math.round(value as number) : fallback
}

function statList(values: number[] | undefined): string {
  const list = Array.from({ length: 8 }, (_, i) => Math.max(0, intOr(values?.[i], 0)))
  return list.join(',')
}

export function normalizeDinoName(name: string | undefined): string {
  const trimmed = (name ?? '').trim()
  return trimmed === '' ? 'Generated' : trimmed
}

export function sumStats(values: number[]): number {
  return values.reduce((acc, v) => acc + (Number.isFinite(v) ? Math.max(0, Math.round(v)) : 0), 0)
}

export function buildSpawnExactDinoCommand(opts: SpawnExactDinoOptions): string {
  const prefix = opts.prefix ?? 'cheat'

  const parts: string[] = [
    quoted(opts.creature.blueprintPath), // 1  DinoBlueprintPath
    quoted(opts.saddleBlueprintPath ?? ''), // 2  SaddleBlueprintPath
    String(intOr(opts.saddleQuality, 0)), // 3  SaddleQuality
    String(Math.max(1, intOr(opts.baseLevel, 1))), // 4  BaseLevel
    String(Math.max(0, intOr(opts.extraLevels, 0))), // 5  ExtraLevels
    quoted(statList(opts.baseStats)), // 6  BaseStats
    quoted(statList(opts.addedStats)), // 7  AddedStats
    quoted(normalizeDinoName(opts.dinoName)), // 8  DinoName
    opts.cloned ? '1' : '0', // 9  Cloned
    opts.neutered ? '1' : '0', // 10 Neutered
    quoted(opts.tamedOn ?? ''), // 11 TamedOn
    quoted(opts.uploadedFrom ?? ''), // 12 UploadedFrom
    quoted(opts.imprinterName ?? ''), // 13 ImprinterName
    String(intOr(opts.imprinterPlayerId, 0)), // 14 ImprinterPlayerID
    formatImprint(opts.imprintQuality), // 15 ImprintQuality
    quoted(colorList(opts.colors)), // 16 Colors
    String(intOr(opts.dinoId, 0)), // 17 DinoID
    String(intOr(opts.exp, 0)), // 18 Exp
    String(intOr(opts.spawnDistance, 0)), // 19 spawnDistance
    String(intOr(opts.yOffset, 20)), // 20 YOffset
    String(intOr(opts.zOffset, 20)), // 21 ZOffset
  ]

  return `${prefix} SpawnExactDino ${parts.join(' ')}`
}

function formatImprint(value: number | undefined): string {
  if (!Number.isFinite(value) || (value as number) <= 0) return '0'
  const clamped = Math.min(1, Math.max(0, value as number))
  return String(Number(clamped.toFixed(2)))
}

export function colorList(colors: number[] | undefined): string {
  return Array.from({ length: COLOR_REGION_COUNT }, (_, i) => {
    const v = colors?.[i]
    return Number.isFinite(v) ? Math.max(0, Math.round(v as number)) : 0
  }).join(',')
}

/** Nivel coherente con los puntos de stats: suma de BaseStats + 1 (regla del wiki). */
export function levelFromStats(baseStats: number[]): number {
  return sumStats(baseStats) + 1
}

export function statsFromPreset(statPoints: number, slots: number): number[] {
  return Array.from({ length: 8 }, (_, i) => (i < slots ? statPoints : 0))
}

/**
 * Igual que statsFromPreset pero permite elegir exactamente que stats reciben
 * el valor del preset (por ejemplo, todo 254 menos Movement Speed). `mask[i]`
 * en true aplica statPoints a ese stat; en false lo deja en 0.
 */
export function statsFromMask(statPoints: number, mask: boolean[]): number[] {
  return Array.from({ length: 8 }, (_, i) => (mask[i] ? statPoints : 0))
}

export interface SpawnExactValidationResult {
  errors: string[]
  warnings: string[]
}

export function validateSpawnExact(
  opts: {
    baseLevel: number
    baseStats: number[]
    extraLevels: number
    addedStats: number[]
    colors: number[]
  },
  t: TFn,
): SpawnExactValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!Number.isFinite(opts.baseLevel) || opts.baseLevel < 1) {
    errors.push(t('val.baseLevelMin'))
  }
  if (opts.baseStats.some((v) => v < 0) || opts.addedStats.some((v) => v < 0)) {
    errors.push(t('val.statsNegative'))
  }
  if (opts.colors.some((c) => c < 0 || c > 255)) {
    errors.push(t('val.colorRange'))
  }

  const expectedLevel = levelFromStats(opts.baseStats)
  if (opts.baseLevel !== expectedLevel) {
    warnings.push(t('val.warnBaseLevel', { expected: expectedLevel }))
  }
  const addedSum = sumStats(opts.addedStats)
  if (opts.extraLevels !== addedSum) {
    warnings.push(t('val.warnExtraLevels', { expected: addedSum }))
  }
  return { errors, warnings }
}

/* ---------------------------------------------------------------------------
 * GiveItem / GiveItemNum
 * ------------------------------------------------------------------------ */

export type ItemCommandType = 'GiveItem' | 'GiveItemNum'

export interface GiveItemOptions {
  item: Item
  quantity: number
  quality: number
  blueprint: boolean
  commandType?: ItemCommandType
  prefix?: CheatPrefix
}

export function buildGiveItemCommand(opts: GiveItemOptions): string {
  const prefix = opts.prefix ?? 'admincheat'
  const qty = Math.max(1, Math.round(opts.quantity) || 1)
  const quality = Math.max(0, Math.round(opts.quality) || 0)
  const bp = opts.blueprint ? 1 : 0

  if (opts.commandType === 'GiveItemNum') {
    if (opts.item.itemNumId === undefined) {
      return ''
    }
    return `${prefix} GiveItemNum ${opts.item.itemNumId} ${qty} ${quality} ${bp}`
  }

  return `${prefix} GiveItem "${opts.item.blueprintPath}" ${qty} ${quality} ${bp}`
}

export function supportsGiveItemNum(item: Item): boolean {
  return typeof item.itemNumId === 'number'
}

/* ---------------------------------------------------------------------------
 * Validaciones generales
 * ------------------------------------------------------------------------ */

export function validateLevel(level: number, t: TFn): string | null {
  if (Number.isNaN(level) || level < 1) return t('val.levelMin')
  if (level > 100000) return t('val.levelMax')
  return null
}

export function validateQuantity(quantity: number, t: TFn): string | null {
  if (Number.isNaN(quantity) || quantity < 1) return t('val.quantityMin')
  if (quantity > 500) return t('val.quantityMax')
  return null
}

export function validateQuality(quality: number, t: TFn): string | null {
  if (Number.isNaN(quality) || quality < 0) return t('val.qualityMin')
  if (quality > 100) return t('val.qualityMax')
  return null
}

/* ---------------------------------------------------------------------------
 * Command Builder generico
 * ------------------------------------------------------------------------ */

export function buildGenericCommand(
  command: CommandDef,
  values: Record<string, string>,
  prefix: CheatPrefix = 'admincheat',
): string {
  const parts = command.params.map((p) => {
    const raw = values[p.name] ?? (p.default !== undefined ? String(p.default) : '')
    if (p.type === 'creature' || p.type === 'item') {
      return `"${raw}"`
    }
    if (p.type === 'text' || p.type === 'player') {
      return raw.includes(' ') ? `"${raw}"` : raw
    }
    return raw
  })

  return `${prefix} ${command.name}${parts.length ? ' ' + parts.join(' ') : ''}`.trim()
}
