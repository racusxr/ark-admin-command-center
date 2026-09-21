import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import type { Creature } from '../types'
import { matchesCreature, rankByName } from '../utils/search'
import VariantBadge from './VariantBadge'
import { useI18n } from '../i18n/I18nContext'

interface CreatureSelectorProps {
  creatures: Creature[]
  value: Creature | null
  onChange: (creature: Creature) => void
  label?: string
}

const MAX_RESULTS = 60

export default function CreatureSelector({
  creatures,
  value,
  onChange,
  label,
}: CreatureSelectorProps) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const hits = useMemo(
    () => rankByName(query, creatures.filter((c) => matchesCreature(query, c))),
    [creatures, query],
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
      <label className="field-label">{label ?? t('common.creature')}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="field-input flex items-center justify-between text-left gap-2"
      >
        <span className={`truncate ${value ? 'text-bone' : 'text-bone-faint'}`}>
          {value ? value.name : t('creatureSel.placeholder')}
        </span>
        <ChevronDown size={16} className="text-bone-faint shrink-0" />
      </button>

      {value && (
        <p className="mt-1 text-[11px] font-mono text-bone-faint truncate">
          {value.className} · {value.dlc}
        </p>
      )}

      {open && (
        <div className="absolute z-30 mt-1 w-full panel p-2 max-h-80 overflow-y-auto">
          <div className="relative mb-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-faint" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('creatureSel.query')}
              className="field-input pl-8"
            />
          </div>

          {filtered.length === 0 && (
            <p className="text-sm text-bone-faint px-2 py-3">{t('creatureSel.none')}</p>
          )}

          <ul>
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c)
                    setOpen(false)
                    setQuery('')
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-surface-raised text-sm flex items-center justify-between gap-2"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-bone">{c.name}</span>
                    <span className="block truncate text-[11px] font-mono text-bone-faint">
                      {c.className}
                    </span>
                  </span>
                  <VariantBadge variant={c.variant} />
                </button>
              </li>
            ))}
          </ul>

          {hits.length > filtered.length && (
            <p className="text-[11px] text-bone-faint px-3 py-2">
              {t('sel.showing', { shown: filtered.length, total: hits.length })}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
