import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import creaturesData from '../data/creatures.json'
import type { CheatPrefix, Creature, SpawnCommandType } from '../types'
import CreatureSelector from '../components/CreatureSelector'
import CommandPreview from '../components/CommandPreview'
import FilterBar from '../components/FilterBar'
import PrefixToggle from '../components/PrefixToggle'
import { buildSpawnCommands, validateLevel, validateQuantity } from '../utils/commandGenerator'
import { useI18n } from '../i18n/I18nContext'
import {
  getCheatPrefix,
  getFavorites,
  isFavorite,
  pushHistory,
  setCheatPrefix,
  toggleFavorite,
} from '../utils/storage'

const creatures = creaturesData as Creature[]

const FILTERS = [
  'All', 'Land', 'Flying', 'Aquatic', 'Boss', 'Alpha', 'Tek', 'Aberrant', 'X', 'R', 'DLC',
]

function applyFilter(list: Creature[], filter: string): Creature[] {
  if (filter === 'All') return list
  if (filter === 'Land' || filter === 'Flying' || filter === 'Aquatic') {
    return list.filter((c) => c.movement === filter)
  }
  if (filter === 'DLC') return list.filter((c) => c.dlc !== 'The Island')
  return list.filter((c) => c.variant === filter)
}

export default function Spawn() {
  const { t, tx } = useI18n()
  const [params, setParams] = useSearchParams()

  const [filter, setFilter] = useState('All')
  const [creature, setCreature] = useState<Creature | null>(
    () => creatures.find((c) => c.id === params.get('creature')) ?? null,
  )
  const [level, setLevel] = useState<number>(Number(params.get('level')) || 150)
  const [quantity, setQuantity] = useState<number>(Number(params.get('quantity')) || 1)
  const [tamed, setTamed] = useState<boolean>(params.get('tamed') === 'true')
  const [commandType, setCommandType] = useState<SpawnCommandType>(
    (params.get('type') as SpawnCommandType) || 'SpawnDino',
  )
  const [prefix, setPrefix] = useState<CheatPrefix>(() => getCheatPrefix())
  const [favorites, setFavorites] = useState(getFavorites())

  useEffect(() => {
    if (!creature) return
    setParams(
      {
        creature: creature.id,
        level: String(level),
        quantity: String(quantity),
        tamed: String(tamed),
        type: commandType,
      },
      { replace: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creature, level, quantity, tamed, commandType])

  const filteredCreatures = useMemo(() => applyFilter(creatures, filter), [filter])

  const levelError = validateLevel(level, t)
  const quantityError = validateQuantity(quantity, t)
  const errors = [levelError, quantityError].filter((e): e is string => !!e)

  const commands = useMemo(() => {
    if (!creature || errors.length > 0) return []
    return buildSpawnCommands({ creature, level, quantity, tamed, commandType, prefix })
  }, [creature, level, quantity, tamed, commandType, prefix, errors.length])

  const joined = commands.join('\n')
  const label = creature
    ? `${creature.name} Lv.${level}${quantity > 1 ? ` x${quantity}` : ''}`
    : ''

  function handleReset() {
    setFilter('All')
    setCreature(null)
    setLevel(150)
    setQuantity(1)
    setTamed(false)
    setCommandType('SpawnDino')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display font-bold text-3xl text-bone">{t('spawn.title')}</h1>
        <p className="text-bone-dim mt-1">
          {t('spawn.subtitle')}
        </p>
      </div>

      <div className="panel p-5 space-y-5">
        <PrefixToggle value={prefix} onChange={(p) => setPrefix(setCheatPrefix(p))} />

        <div>
          <label className="field-label">{t('common.filter')}</label>
          <FilterBar
            options={FILTERS}
            active={filter}
            onChange={setFilter}
            renderLabel={(o) => tx(`filter.${o}`, o)}
          />
        </div>

        <CreatureSelector creatures={filteredCreatures} value={creature} onChange={setCreature} />

        {creature && (
          <p className="text-xs text-bone-faint -mt-2 break-all font-mono">
            {creature.blueprintPath}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">{t('common.level')}</label>
            <input
              type="number"
              className="field-input"
              value={level}
              min={1}
              onChange={(e) => setLevel(Number(e.target.value))}
            />
            {levelError && <p className="text-xs text-danger mt-1">{levelError}</p>}
          </div>
          <div>
            <label className="field-label">{t('common.quantity')}</label>
            <input
              type="number"
              className="field-input"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            {quantityError && <p className="text-xs text-danger mt-1">{quantityError}</p>}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-bone-dim cursor-pointer select-none">
            <input
              type="checkbox"
              checked={tamed}
              onChange={(e) => setTamed(e.target.checked)}
              className="accent-rust w-4 h-4"
            />
            {t('common.tamed')}
          </label>

          <div className="flex items-center gap-2">
            {(['SpawnDino', 'GMSummon', 'Summon'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setCommandType(t)}
                className={`px-3 py-1.5 rounded-md text-sm font-display font-semibold border transition-colors ${
                  commandType === t
                    ? 'bg-tek text-ink border-tek'
                    : 'bg-ink text-bone-dim border-surface-line hover:border-tek/60'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {commandType !== 'SpawnDino' && tamed && (
          <p className="text-xs text-bone-faint">
            {t('spawn.note')}
          </p>
        )}
      </div>

      <CommandPreview
        commands={commands}
        errors={!creature ? [] : errors}
        favoriteActive={isFavorite(joined, favorites)}
        onFavoriteToggle={
          creature ? () => setFavorites(toggleFavorite({ label, command: joined })) : undefined
        }
        onReset={handleReset}
        onCopied={() => creature && pushHistory({ label, command: joined })}
      />
    </div>
  )
}
