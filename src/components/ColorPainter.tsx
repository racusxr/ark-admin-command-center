import { useMemo, useState } from 'react'
import { Eraser, Search, Undo2 } from 'lucide-react'
import type { ArkColor, ColorPreset } from '../types'
import { matchesColor, rankByName } from '../utils/search'
import { useI18n } from '../i18n/I18nContext'
import { COLOR_REGION_COUNT } from '../utils/commandGenerator'
import { ColorSwatch } from './ColorPicker'

type PaletteGroup = 'Base' | 'Dye' | 'All'
const GROUPS: PaletteGroup[] = ['Base', 'Dye', 'All']
type PresetGroup = 'solid' | 'theme' | 'pair'
const PRESET_GROUPS: PresetGroup[] = ['solid', 'theme', 'pair']

interface ColorPainterProps {
  colors: ArkColor[]
  presets: ColorPreset[]
  /** IDs de color actuales por region (6 valores). */
  value: number[]
  onApply: (next: number[]) => void
  onUndo: () => void
  canUndo: boolean
}

/**
 * Flujo en tres pasos, todo en el mismo lugar:
 *  1. Elegir a que regiones se aplica (por defecto las 6).
 *  2. Tocar un preset o un color de la paleta: se aplica solo a esas regiones.
 *  3. Repetir con otras regiones/presets para combinarlos. "Deshacer" revierte.
 */
export default function ColorPainter({
  colors,
  presets,
  value,
  onApply,
  onUndo,
  canUndo,
}: ColorPainterProps) {
  const { t, tx } = useI18n()
  const [targets, setTargets] = useState<boolean[]>(() => Array(COLOR_REGION_COUNT).fill(true))
  const [group, setGroup] = useState<PaletteGroup>('Base')
  const [presetGroup, setPresetGroup] = useState<PresetGroup>('theme')
  const [query, setQuery] = useState('')
  const [hovered, setHovered] = useState<ArkColor | null>(null)
  const [lastPainted, setLastPainted] = useState<ArkColor | null>(null)

  const targetCount = targets.filter(Boolean).length
  const noTargets = targetCount === 0
  const colorById = useMemo(() => new Map(colors.map((c) => [c.colorId, c])), [colors])
  const colorName = (c: ArkColor) => (c.colorId === 0 ? t('color.unset') : c.name)

  const paletteColors = useMemo(() => {
    const pool = colors.filter((c) => c.group !== 'Special' && (group === 'All' || c.group === group))
    return rankByName(query, pool.filter((c) => matchesColor(query, c)))
  }, [colors, group, query])

  const applicablePresets = presets.filter(
    (p) => p.colors !== null && (p.group ?? 'theme') === presetGroup,
  )

  function toggleTarget(i: number) {
    setTargets((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  }

  function paint(colorId: number) {
    if (noTargets) return
    onApply(value.map((v, i) => (targets[i] ? colorId : v)))
    setLastPainted(colorById.get(colorId) ?? null)
  }

  function applyPreset(p: ColorPreset) {
    if (noTargets || !p.colors) return
    onApply(value.map((v, i) => (targets[i] ? p.colors![i] ?? 0 : v)))
    setLastPainted(null)
  }

  const isPresetActive = (p: ColorPreset) =>
    p.colors !== null && p.colors.every((c, i) => c === value[i])

  const chip = (active: boolean) =>
    `px-3 min-h-11 sm:min-h-8 rounded-full text-xs font-display font-semibold tracking-wide border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
      active
        ? 'bg-rust text-ink border-rust'
        : 'bg-surface text-bone-dim border-surface-line hover:border-rust/60 hover:text-bone'
    }`

  const info = hovered ?? lastPainted

  return (
    <div className="space-y-4">
      {/* 1. Regiones destino */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="field-label mb-0">{t('color.applyTo')}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="btn-ghost text-xs px-2 py-1"
              onClick={() => setTargets(Array(COLOR_REGION_COUNT).fill(true))}
            >
              {t('color.selectAll')}
            </button>
            <button
              type="button"
              className="btn-ghost text-xs px-2 py-1"
              onClick={() => setTargets(Array(COLOR_REGION_COUNT).fill(false))}
            >
              {t('color.selectNone')}
            </button>
            <button
              type="button"
              className="btn-ghost text-xs px-2 py-1"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo2 size={14} />
              {t('color.undo')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2" role="group" aria-label={t('color.applyTo')}>
          {Array.from({ length: COLOR_REGION_COUNT }, (_, i) => {
            const c = colorById.get(value[i] ?? 0)
            const active = targets[i]
            const name = c ? colorName(c) : String(value[i])
            return (
              <button
                key={i}
                type="button"
                aria-pressed={active}
                aria-label={t('color.regionToggle', { n: i, name, id: value[i] })}
                title={`${t('color.region', { n: i })}: ${name} (${value[i]})`}
                onClick={() => toggleTarget(i)}
                className={`flex flex-col items-center justify-center gap-1 rounded-md border py-2 min-h-11 transition-colors ${
                  active
                    ? 'bg-surface-raised border-rust ring-1 ring-rust/40'
                    : 'bg-ink border-surface-line hover:border-rust/60'
                }`}
              >
                <ColorSwatch hex={c?.hex ?? '#000000'} size={22} />
                <span
                  className={`font-mono text-[11px] ${active ? 'text-bone' : 'text-bone-faint'}`}
                >
                  {i} · {value[i]}
                </span>
              </button>
            )
          })}
        </div>
        <p className="text-[11px] text-bone-faint mt-2" aria-live="polite">
          {noTargets
            ? t('color.noneSelected')
            : t('color.targets', { count: targetCount, total: COLOR_REGION_COUNT })}
        </p>
      </div>

      {/* 2a. Presets (combinables: se aplican solo a las regiones elegidas) */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="field-label mb-0">{t('color.presets')}</span>
          <div
            className="inline-flex rounded-md border border-surface-line overflow-hidden"
            role="group"
            aria-label={t('color.presets')}
          >
            {PRESET_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={presetGroup === g}
                onClick={() => setPresetGroup(g)}
                className={`px-3 min-h-11 sm:min-h-8 text-xs font-display font-semibold transition-colors ${
                  presetGroup === g
                    ? 'bg-surface-raised text-bone'
                    : 'text-bone-faint hover:text-bone'
                }`}
              >
                {t(`color.presetGroup.${g}` as 'color.presetGroup.solid')}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {applicablePresets.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={noTargets}
              aria-pressed={isPresetActive(p)}
              title={tx(`preset.color.${p.id}.desc`, p.description)}
              onClick={() => applyPreset(p)}
              className={`${chip(isPresetActive(p))} inline-flex items-center gap-2`}
            >
              <span className="inline-flex overflow-hidden rounded-sm border border-surface-line/60">
                {(p.colors ?? []).map((id, i) => (
                  <span
                    key={i}
                    className="block w-2 h-3.5"
                    style={{ backgroundColor: colorById.get(id)?.hex ?? '#000000' }}
                  />
                ))}
              </span>
              {tx(`preset.color.${p.id}.label`, p.label)}
            </button>
          ))}
          <button
            type="button"
            disabled={noTargets}
            onClick={() => paint(0)}
            className={`${chip(false)} inline-flex items-center gap-1`}
          >
            <Eraser size={13} />
            {t('color.clear')}
          </button>
        </div>
      </div>

      {/* 2b. Paleta rapida */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="field-label mb-0">{t('color.palette')}</span>
          <div
            className="inline-flex rounded-md border border-surface-line overflow-hidden"
            role="group"
            aria-label={t('color.palette')}
          >
            {GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={group === g}
                onClick={() => setGroup(g)}
                className={`px-3 min-h-11 sm:min-h-8 text-xs font-display font-semibold transition-colors ${
                  group === g ? 'bg-surface-raised text-bone' : 'text-bone-faint hover:text-bone'
                }`}
              >
                {t(`color.group${g}` as 'color.groupBase')}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-2">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('color.paletteSearch')}
            className="field-input pl-8"
          />
        </div>

        <div className="max-h-56 overflow-y-auto rounded-md border border-surface-line bg-ink p-2">
          {paletteColors.length === 0 ? (
            <p className="text-sm text-bone-faint px-1 py-2">{t('color.none')}</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-1.5">
              {paletteColors.map((c) => {
                const applied = !noTargets && value.every((v, i) => !targets[i] || v === c.colorId)
                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={noTargets}
                    aria-label={`${colorName(c)} (${c.colorId})`}
                    aria-pressed={applied}
                    title={`${colorName(c)} (${c.colorId})`}
                    onClick={() => paint(c.colorId)}
                    onMouseEnter={() => setHovered(c)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(c)}
                    onBlur={() => setHovered(null)}
                    style={{ backgroundColor: c.hex }}
                    className={`aspect-square rounded-md border transition-transform motion-safe:hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed ${
                      applied
                        ? 'border-bone ring-2 ring-bone ring-offset-1 ring-offset-ink'
                        : 'border-surface-line'
                    }`}
                  />
                )
              })}
            </div>
          )}
        </div>

        <p className="mt-2 text-xs text-bone-dim min-h-[1rem] flex items-center gap-2" aria-live="polite">
          {info ? (
            <>
              <ColorSwatch hex={info.hex} />
              <span className="text-bone">{colorName(info)}</span>
              <span className="font-mono text-bone-faint">{info.colorId}</span>
            </>
          ) : (
            <span className="text-bone-faint">{t('color.paletteHint')}</span>
          )}
        </p>
      </div>
    </div>
  )
}
