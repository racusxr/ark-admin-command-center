import { PIXEL_FONT, PIXEL_FONT_COLS, PIXEL_FONT_ROWS } from '../data/pixelFont'
import type { CheatPrefix, CustomCaveConfig, CustomCaveObjectDef } from '../types'
import { resolveCustomCaveBlueprint } from './customCaveCommand'

function quoted(value: string): string {
  return `"${(value ?? '').replace(/"/g, '')}"`
}

export interface PixelTextResult {
  command: string
  total: number
  /** Caracteres del texto que no tienen glifo (se omiten, no se inventan). */
  unsupported: string[]
}

/**
 * Genera un SpawnActor por cada "pixel" encendido de las letras del texto,
 * formando una pared plana frente al jugador: X se mantiene fijo
 * (spawnDistance = que tan lejos esta la pared), Y avanza en horizontal por
 * columna (spacingY), Z sube en vertical por fila (spacingZ). Todo se
 * encadena en un unico comando con " | ", igual que la cuadricula normal.
 */
export function buildPixelTextCommand(
  def: CustomCaveObjectDef,
  cfg: CustomCaveConfig,
): PixelTextResult {
  const empty: PixelTextResult = { command: '', total: 0, unsupported: [] }
  if (def.commandMethod !== 'SpawnActor') return empty

  const prefix: CheatPrefix = cfg.prefix ?? 'admincheat'
  const blueprint = resolveCustomCaveBlueprint(def, cfg.variantId)
  if (!blueprint) return empty

  const text = (cfg.text ?? '').toUpperCase()
  if (!text.trim()) return empty

  const letterGap = Math.max(0, Math.round(cfg.letterGap) || 0)
  const spacingY = Number.isFinite(cfg.spacingY) ? cfg.spacingY : 0
  const spacingZ = Number.isFinite(cfg.spacingZ) ? cfg.spacingZ : 0
  const originX = Number.isFinite(cfg.spawnDistance) ? Math.round(cfg.spawnDistance) : 0
  const originY = Number.isFinite(cfg.yOffset) ? cfg.yOffset : 0
  const originZ = Number.isFinite(cfg.zOffset) ? cfg.zOffset : 0

  const unsupported: string[] = []
  const commands: string[] = []
  let colCursor = 0

  for (const ch of text) {
    const glyph = PIXEL_FONT[ch]
    if (!glyph) {
      if (ch !== ' ' && !unsupported.includes(ch)) unsupported.push(ch)
      colCursor += PIXEL_FONT_COLS + letterGap
      continue
    }
    for (let r = 0; r < PIXEL_FONT_ROWS; r++) {
      const row = glyph[r]
      for (let c = 0; c < PIXEL_FONT_COLS; c++) {
        if (row[c] !== '#') continue
        const y = Math.round(originY + (colCursor + c) * spacingY)
        // Fila 0 del glifo es la de arriba: se invierte para que quede
        // arriba tambien en Z (que sube).
        const z = Math.round(originZ + (PIXEL_FONT_ROWS - 1 - r) * spacingZ)
        commands.push(
          `${prefix} SpawnActor ${quoted(`Blueprint'${blueprint}'`)} ${originX} ${y} ${z}`,
        )
      }
    }
    colCursor += PIXEL_FONT_COLS + letterGap
  }

  return { command: commands.join(' | '), total: commands.length, unsupported }
}
