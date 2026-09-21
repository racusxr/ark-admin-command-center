import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import type { ArkColor } from '../types'
import { matchesColor, rankByName } from '../utils/search'
import { useI18n } from '../i18n/I18nContext'

interface ColorPickerProps {
  colors: ArkColor[]
  /** ID numerico real de ARK (0 = sin color). */
  value: number
  onChange: (colorId: number) => void
  /** Region de color 0-5. */
  region: number
  regionLabel?: string
}

const MAX_RESULTS = 80

export function ColorSwatch({ hex, size = 14 }: { hex: string; size?: number }) {
  return (
    <span
      className="inline-block rounded-sm border border-surface-line shrink-0"
      style={{ width: size, height: size, backgroundColor: hex }}
    />
  )
}

export default function ColorPicker({
  colors,
  value,
  onChange,
  region,
  regionLabel,
}: ColorPickerProps) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = useMemo(
    () => colors.find((c) => c.colorId === value) ?? null,
    [colors, value],
  )

  /** El color 0 ("sin color") no es un color del juego: su nombre sí se traduce. */
  const colorName = (c: ArkColor) => (c.colorId === 0 ? t('color.unset') : c.name)

  const hits = useMemo(
    () => rankByName(query, colors.filter((c) => matchesColor(query, c))),
    [colors, query],
  )
  const filtered = hits.slice(0, MAX_RESULTS)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <label className="field-label flex items-center justify-between">
        <span>{regionLabel ?? t('color.region', { n: region })}</span>
        <span className="font-mono text-[10px] text-bone-faint">{t('color.regionShort', { n: region })}</span>
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="field-input flex items-center justify-between text-left gap-2"
      >
        <span className="flex items-center gap-2 min-w-0">
          <ColorSwatch hex={selected?.hex ?? '#000000'} />
          <span className={`truncate ${selected ? 'text-bone' : 'text-bone-faint'}`}>
            {selected ? colorName(selected) : t('color.search')}
          </span>
          <span className="font-mono text-[11px] text-bone-faint shrink-0">{value}</span>
        </span>
        <ChevronDown size={16} className="text-bone-faint shrink-0" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full panel p-2 max-h-72 overflow-y-auto">
          <div className="relative mb-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-faint" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('color.query')}
              className="field-input pl-8"
            />
          </div>

          {filtered.length === 0 && (
            <p className="text-sm text-bone-faint px-2 py-3">{t('color.none')}</p>
          )}

          <ul>
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c.colorId)
                    setOpen(false)
                    setQuery('')
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-surface-raised text-sm flex items-center gap-2 ${
                    c.colorId === value ? 'bg-surface-raised' : ''
                  }`}
                >
                  <ColorSwatch hex={c.hex} />
                  <span className="truncate flex-1 text-bone">{colorName(c)}</span>
                  <span className="font-mono text-[11px] text-bone-faint">{c.colorId}</span>
                </button>
              </li>
            ))}
          </ul>

          {hits.length > filtered.length && (
            <p className="text-[11px] text-bone-faint px-3 py-2">
              {t('color.showing', { shown: filtered.length, total: hits.length })}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
