import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import creaturesData from '../data/creatures.json'
import type { Creature } from '../types'
import FilterBar from '../components/FilterBar'
import SearchBar from '../components/SearchBar'
import CopyButton from '../components/CopyButton'
import VariantBadge from '../components/VariantBadge'
import { matchesCreature, rankByName } from '../utils/search'
import { buildSpawnCommand } from '../utils/commandGenerator'
import { getCheatPrefix } from '../utils/storage'
import { useI18n } from '../i18n/I18nContext'

const creatures = creaturesData as Creature[]

const FILTERS = [
  'All', 'Land', 'Flying', 'Aquatic', 'Boss', 'Alpha', 'Tek', 'Aberrant', 'X', 'R', 'DLC',
]

const MAX_CARDS = 60

export default function Creatures() {
  const { t, tx } = useI18n()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const prefix = getCheatPrefix()

  const filtered = useMemo(() => {
    const byFilter = creatures.filter((c) => {
      if (filter === 'All') return true
      if (filter === 'Land' || filter === 'Flying' || filter === 'Aquatic') {
        return c.movement === filter
      }
      if (filter === 'DLC') return c.dlc !== 'The Island'
      return c.variant === filter
    })
    return rankByName(query, byFilter.filter((c) => matchesCreature(query, c)))
  }, [query, filter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl text-bone">{t('creatures.title')}</h1>
        <p className="text-bone-dim mt-1">
          {t('creatures.subtitle', { count: creatures.length })}
        </p>
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder={t('creatures.search')} />
      <FilterBar
        options={FILTERS}
        active={filter}
        onChange={setFilter}
        renderLabel={(o) => tx(`filter.${o}`, o)}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.slice(0, MAX_CARDS).map((c) => (
          <div key={c.id} className="panel p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-semibold text-bone">{c.name}</h3>
              <VariantBadge variant={c.variant} />
            </div>
            <p className="text-[11px] font-mono text-bone-faint break-all">{c.className}</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="badge bg-surface-raised text-bone-dim">{c.dlc}</span>
              <span className="badge bg-surface-raised text-bone-dim">
                {tx(`movement.${c.movement}`, c.movement)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                type="button"
                className="btn-secondary text-xs px-2.5 py-1.5"
                onClick={() => navigate(`/spawn-exact?creature=${c.id}`)}
              >
                {t('common.spawnExact')}
              </button>
              <CopyButton
                text={buildSpawnCommand({
                  creature: c,
                  level: 150,
                  quantity: 1,
                  tamed: false,
                  commandType: 'SpawnDino',
                  prefix,
                })}
                label={t('common.copyLevel', { level: 150 })}
                variant="ghost"
                className="text-xs px-2.5 py-1.5"
              />
            </div>
          </div>
        ))}
      </div>

      {filtered.length > MAX_CARDS && (
        <p className="text-xs text-bone-faint">
          {t('creatures.showing', { shown: MAX_CARDS, total: filtered.length })}
        </p>
      )}
      {filtered.length === 0 && (
        <p className="text-bone-faint text-sm">{t('creatures.none')}</p>
      )}
    </div>
  )
}
