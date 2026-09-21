import type { TFn } from '../i18n/I18nContext'
import type { CheatPrefix, CustomCaveConfig, CustomCaveObjectDef } from '../types'

function quoted(value: string): string {
  // ARK no admite comillas dobles dentro del argumento: se limpian.
  return `"${(value ?? '').replace(/"/g, '')}"`
}

/** Resuelve el blueprint a usar segun el metodo de comando del objeto elegido. */
export function resolveCustomCaveBlueprint(
  def: CustomCaveObjectDef,
  variantId?: string,
): string {
  if (def.commandMethod === 'SpawnActor') {
    // Tribute Terminal tiene variantes (color); Loadout Mannequin no, y usa
    // directamente itemBlueprintPath como blueprint del actor a spawnear.
    const variant = def.variants?.find((v) => v.id === variantId) ?? def.variants?.[0]
    return variant?.blueprintPath ?? def.itemBlueprintPath ?? ''
  }
  return def.itemBlueprintPath ?? ''
}

/** Cuantas copias en total generaria la cuadricula width x length x height. */
export function customCaveGridTotal(cfg: CustomCaveConfig): number {
  const w = Math.max(1, Math.round(cfg.width) || 1)
  const l = Math.max(1, Math.round(cfg.length) || 1)
  const h = Math.max(1, Math.round(cfg.height) || 1)
  return w * l * h
}

/**
 * Genera el comando real para el objeto de Custom Cave elegido.
 *
 * SpawnActor <BlueprintPath> <SpawnDistance> <YOffset> <ZOffset>
 *   - Coloca el actor relativo a la posicion/mira del jugador.
 *   - No acepta rotacion ni nombre: por eso cfg.pitch/yaw/roll/name no
 *     aparecen en el comando (se guardan solo como referencia del usuario).
 *   - Para colocar varias copias formando una cuadricula (pared/sala de un
 *     Custom Cave), se repite el comando una vez por celda de la
 *     cuadricula Width x Length x Height, incrementando X/Y/Z segun el
 *     espaciado, y se encadenan con " | " (tecnica real y documentada:
 *     ARK permite pegar varios comandos separados por "|" en una sola
 *     ejecucion de consola, repitiendo el prefijo antes de cada uno,
 *     igual que en las listas de comandos de Custom Cave de la comunidad).
 *
 * GiveItem <BlueprintPath> <Quantity> <Quality> <ForceBlueprint>
 *   - Da el item al jugador, que lo coloca a mano en el mundo (no admite
 *     cuadricula: la "cantidad" ya la cubre el propio parametro Quantity).
 */
export function buildCustomCaveCommand(def: CustomCaveObjectDef, cfg: CustomCaveConfig): string {
  const prefix: CheatPrefix = cfg.prefix ?? 'admincheat'
  const blueprint = resolveCustomCaveBlueprint(def, cfg.variantId)
  if (!blueprint) return ''

  if (def.commandMethod === 'SpawnActor') {
    const isGrid = cfg.mode === 'grid'
    const width = isGrid ? Math.max(1, Math.round(cfg.width) || 1) : 1
    const length = isGrid ? Math.max(1, Math.round(cfg.length) || 1) : 1
    const height = isGrid ? Math.max(1, Math.round(cfg.height) || 1) : 1
    const spacingX = Number.isFinite(cfg.spacingX) ? cfg.spacingX : 0
    const spacingY = Number.isFinite(cfg.spacingY) ? cfg.spacingY : 0
    const spacingZ = Number.isFinite(cfg.spacingZ) ? cfg.spacingZ : 0
    const baseX = Number.isFinite(cfg.spawnDistance) ? cfg.spawnDistance : 0
    const baseY = Number.isFinite(cfg.yOffset) ? cfg.yOffset : 0
    const baseZ = Number.isFinite(cfg.zOffset) ? cfg.zOffset : 0

    const commands: string[] = []
    for (let k = 0; k < height; k++) {
      for (let j = 0; j < length; j++) {
        for (let i = 0; i < width; i++) {
          const x = Math.round(baseX + i * spacingX)
          const y = Math.round(baseY + j * spacingY)
          const z = Math.round(baseZ + k * spacingZ)
          commands.push(
            `${prefix} SpawnActor ${quoted(`Blueprint'${blueprint}'`)} ${x} ${y} ${z}`,
          )
        }
      }
    }
    return commands.join(' | ')
  }

  const qty = Math.max(1, Math.round(cfg.quantity) || 1)
  const quality = Math.max(0, Math.round(cfg.quality) || 0)
  const bp = cfg.blueprint ? 1 : 0
  return `${prefix} GiveItem ${quoted(`Blueprint'${blueprint}'`)} ${qty} ${quality} ${bp}`
}

export interface CustomCaveValidationResult {
  errors: string[]
  warnings: string[]
}

const MAX_NAME_LENGTH = 60
/** A partir de este total, la consola/RCON puede tener problemas con un
 * comando tan largo: se avisa, pero no se bloquea (el usuario decide). */
export const GRID_WARNING_THRESHOLD = 150

export function validateCustomCave(
  def: CustomCaveObjectDef,
  cfg: CustomCaveConfig,
  t: TFn,
): CustomCaveValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!cfg.name.trim()) {
    errors.push(t('cave.val.nameRequired'))
  } else if (cfg.name.trim().length > MAX_NAME_LENGTH) {
    errors.push(t('cave.val.nameTooLong', { max: MAX_NAME_LENGTH }))
  }

  if (def.commandMethod === 'SpawnActor') {
    const nums = [cfg.spawnDistance, cfg.yOffset, cfg.zOffset]
    if (!nums.every((n) => Number.isFinite(n))) {
      errors.push(t('cave.val.positionInvalid'))
    }

    if (cfg.mode === 'grid') {
      const dims = [cfg.width, cfg.length, cfg.height]
      if (!dims.every((n) => Number.isFinite(n) && n >= 1)) {
        errors.push(t('cave.val.gridInvalid'))
      }
      const spacings = [cfg.spacingX, cfg.spacingY, cfg.spacingZ]
      if (!spacings.every((n) => Number.isFinite(n))) {
        errors.push(t('cave.val.spacingInvalid'))
      }

      const total = customCaveGridTotal(cfg)
      if (errors.length === 0 && total > GRID_WARNING_THRESHOLD) {
        warnings.push(t('cave.grid.totalWarning', { count: total }))
      }
    }

    if (cfg.mode === 'text') {
      if (!cfg.text.trim()) {
        errors.push(t('cave.text.empty'))
      }
      const spacings = [cfg.spacingY, cfg.spacingZ]
      if (!spacings.every((n) => Number.isFinite(n))) {
        errors.push(t('cave.val.spacingInvalid'))
      }
    }
  }

  if (def.commandMethod === 'GiveItem') {
    if (!Number.isFinite(cfg.quantity) || cfg.quantity < 1) {
      errors.push(t('val.quantityMin'))
    }
    if (!Number.isFinite(cfg.quality) || cfg.quality < 0) {
      errors.push(t('val.qualityMin'))
    }
  }

  if (![cfg.pitch, cfg.yaw, cfg.roll].every((n) => Number.isFinite(n))) {
    warnings.push(t('cave.val.rotationInvalid'))
  }

  return { errors, warnings }
}
