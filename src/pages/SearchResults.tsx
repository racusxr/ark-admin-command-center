import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import creaturesData from '../data/creatures.json'
import itemsData from '../data/items.json'
import type { Creature, Item } from '../types'
import SearchBar from '../components/SearchBar'
import CopyButton from '../components/CopyButton'
import { searchAll } from '../utils/search'
import { buildGiveItemCommand, buildSpawnCommand } from '../utils/commandGenerator'
import { useI18n } from '../i18n/I18nContext'
import { useCommands } from '../i18n/commands'

const creatures = creaturesData as Creature[]
const items = itemsData as Item[]

export default function SearchResults() {
  const { t, tx } = useI18n()
  const commands = useCommands()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const query = params.get('q') ?? ''

  const results = useMemo(() => searchAll(query, creatures, items, commands), [query, commands])
  const totalResults = results.creatures.length + results.items.length + results.commands.length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-bone">{t('search.title')}</h1>
        <p className="text-bone-dim mt-1">{t('search.subtitle')}</p>
      </div>

      <SearchBar
        value={query}
        onChange={(v) => setParams(v ? { q: v } : {})}
        autoFocus
      />

      {query.trim() === '' && (
        <p className="text-bone-faint text-sm">{t('search.prompt')}</p>
      )}

      {query.trim() !== '' && totalResults === 0 && (
        <p className="text-bone-faint text-sm">{t('search.noResults', { query })}</p>
      )}

      {results.creatures.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display font-semibold text-bone-dim text-sm tracking-wide">
            {t('search.creatures', { count: results.creatures.length })}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.creatures.map((c) => {
              const quickCommand = buildSpawnCommand({
                creature: c,
                level: 150,
                quantity: 1,
                tamed: false,
                commandType: 'SpawnDino',
              })
              return (
                <div key={c.id} className="panel p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-semibold text-bone">{c.name}</h3>
                    <span className="badge bg-surface-raised text-bone-dim shrink-0">{c.variant}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      className="btn-secondary text-xs px-2.5 py-1.5"
                      onClick={() => navigate(`/spawn?creature=${c.id}`)}
                    >
                      {t('common.configure')}
                    </button>
                    <CopyButton
                      text={quickCommand}
                      label={t('common.copyLevel', { level: 150 })}
                      variant="ghost"
                      className="text-xs px-2.5 py-1.5"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {results.items.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display font-semibold text-bone-dim text-sm tracking-wide">
            {t('search.items', { count: results.items.length })}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.items.map((i) => (
              <div key={i.id} className="panel p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-bone">{i.name}</h3>
                  <span className="badge bg-surface-raised text-bone-dim shrink-0">
                    {tx(`itemcat.${i.category}`, i.category)}
                  </span>
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    className="btn-secondary text-xs px-2.5 py-1.5"
                    onClick={() => navigate('/items')}
                  >
                    {t('common.configure')}
                  </button>
                  <CopyButton
                    text={buildGiveItemCommand({ item: i, quantity: 1, quality: 0, blueprint: false })}
                    label={t('common.copy')}
                    variant="ghost"
                    className="text-xs px-2.5 py-1.5"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {results.commands.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display font-semibold text-bone-dim text-sm tracking-wide">
            {t('search.commands', { count: results.commands.length })}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {results.commands.map((c) => (
              <div key={c.id} className="panel p-4 flex flex-col gap-2">
                <h3 className="font-display font-semibold text-bone">{c.name}</h3>
                <p className="text-xs text-bone-dim">{c.description}</p>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    className="btn-secondary text-xs px-2.5 py-1.5"
                    onClick={() => navigate('/commands')}
                  >
                    {t('search.openInCommands')}
                  </button>
                  <CopyButton
                    text={c.example}
                    label={t('common.copy')}
                    variant="ghost"
                    className="text-xs px-2.5 py-1.5"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
