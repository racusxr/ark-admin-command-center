import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, ChevronRight, Info } from 'lucide-react'
import creaturesData from '../data/creatures.json'
import colorsData from '../data/colors.json'
import itemsData from '../data/items.json'
import presetsData from '../data/spawnPresets.json'
import type { ArkColor, CheatPrefix, Creature, Item, SpawnPresets } from '../types'
import CreatureSelector from '../components/CreatureSelector'
import ColorPicker from '../components/ColorPicker'
import CommandPreview from '../components/CommandPreview'
import FilterBar from '../components/FilterBar'
import PrefixToggle from '../components/PrefixToggle'
import {
  COLOR_REGION_COUNT,
  STAT_ORDER,
  buildSpawnExactDinoCommand,
  levelFromStats,
  statsFromMask,
  validateSpawnExact,
} from '../utils/commandGenerator'
import {
  getCheatPrefix,
  getFavorites,
  isFavorite,
  pushHistory,
  setCheatPrefix,
  toggleFavorite,
} from '../utils/storage'
import { useI18n } from '../i18n/I18nContext'

const creatures = creaturesData as Creature[]
const colors = colorsData as ArkColor[]
const items = itemsData as Item[]
const presets = presetsData as unknown as SpawnPresets

const saddles = items.filter((i) => i.category === 'Saddles')

const FILTERS = [
  'All', 'Land', 'Flying', 'Aquatic', 'Boss', 'Alpha', 'Tek', 'Aberrant', 'X', 'R', 'DLC',
]

function applyFilter(list: Creature[], filter: string): Creature[] {
  switch (filter) {
    case 'All':
      return list
    case 'Land':
    case 'Flying':
    case 'Aquatic':
      return list.filter((c) => c.movement === filter)
    case 'DLC':
      return list.filter((c) => c.dlc !== 'The Island')
    default:
      return list.filter((c) => c.variant === filter)
  }
}

const DEFAULT_PRESET = 'flex-254'
const DEFAULT_COLOR_PRESET = 'default'
const EMPTY_STATS = [0, 0, 0, 0, 0, 0, 0, 0]
// Crafting Skill (indice 7) no se usa en criaturas salvajes, asi que no se
// ofrece como opcion en el selector de stats del preset.
const WILD_STAT_COUNT = 7
const DEFAULT_ENABLED_STATS = Array.from({ length: 8 }, (_, i) => i < WILD_STAT_COUNT)

function defaultCreature(): Creature {
  return creatures.find((c) => c.name === 'Rex') ?? creatures[0]
}

export default function SpawnExact() {
  const { t, tx } = useI18n()
  const [params, setParams] = useSearchParams()

  const [filter, setFilter] = useState('All')
  const [creature, setCreature] = useState<Creature>(
    () => creatures.find((c) => c.id === params.get('creature')) ?? defaultCreature(),
  )
  const [levelPresetId, setLevelPresetId] = useState(params.get('preset') ?? DEFAULT_PRESET)
  const [enabledStats, setEnabledStats] = useState<boolean[]>(() => [...DEFAULT_ENABLED_STATS])
  const [baseStats, setBaseStats] = useState<number[]>(() =>
    statsFromMask(254, DEFAULT_ENABLED_STATS),
  )
  const [baseLevel, setBaseLevel] = useState<number>(() => Number(params.get('level')) || 1779)
  const [dinoName, setDinoName] = useState(params.get('name') ?? 'Generated')
  const [colorPresetId, setColorPresetId] = useState(DEFAULT_COLOR_PRESET)
  const [regionColors, setRegionColors] = useState<number[]>(() => Array(COLOR_REGION_COUNT).fill(0))

  // Advanced
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [saddleId, setSaddleId] = useState('')
  const [saddleQuality, setSaddleQuality] = useState(0)
  const [extraLevels, setExtraLevels] = useState(0)
  const [addedStats, setAddedStats] = useState<number[]>([...EMPTY_STATS])
  const [cloned, setCloned] = useState(false)
  const [neutered, setNeutered] = useState(false)
  const [imprintQuality, setImprintQuality] = useState(0)
  const [imprinterName, setImprinterName] = useState('')
  const [imprinterPlayerId, setImprinterPlayerId] = useState(0)
  const [tamedOn, setTamedOn] = useState('')
  const [uploadedFrom, setUploadedFrom] = useState('')
  const [dinoId, setDinoId] = useState(0)
  const [exp, setExp] = useState(0)
  const [spawnDistance, setSpawnDistance] = useState(0)
  const [yOffset, setYOffset] = useState(20)
  const [zOffset, setZOffset] = useState(20)

  const [prefix, setPrefix] = useState<CheatPrefix>(() => getCheatPrefix())
  const [favorites, setFavorites] = useState(getFavorites())

  const filteredCreatures = useMemo(() => applyFilter(creatures, filter), [filter])

  // Sincroniza la URL para poder compartir la configuracion.
  useEffect(() => {
    setParams(
      {
        creature: creature.id,
        preset: levelPresetId,
        level: String(baseLevel),
        name: dinoName,
        colors: regionColors.join(','),
      },
      { replace: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creature, levelPresetId, baseLevel, dinoName, regionColors])

  function handlePrefix(p: CheatPrefix) {
    setPrefix(setCheatPrefix(p))
  }

  function handleLevelPreset(id: string) {
    setLevelPresetId(id)
    const preset = presets.levelPresets.find((p) => p.id === id)
    // "Custom" no toca los valores manuales del usuario.
    if (!preset || preset.statPoints === null) return
    // Solo los stats marcados toman el valor del preset; los demas conservan
    // el numero que el usuario haya puesto (no se fuerzan a 0).
    const stats = baseStats.map((v, i) => (enabledStats[i] ? preset.statPoints! : v))
    setBaseStats(stats)
    setBaseLevel(levelFromStats(stats))
  }

  /**
   * Marca o desmarca un stat como "seguidor" del preset. Al marcarlo, toma de
   * inmediato el valor actual del preset. Al desmarcarlo no se toca su valor:
   * el usuario puede escribir el numero que quiera en el campo de al lado.
   */
  function handleStatToggle(index: number, enabled: boolean) {
    const nextMask = [...enabledStats]
    nextMask[index] = enabled
    setEnabledStats(nextMask)

    const preset = presets.levelPresets.find((p) => p.id === levelPresetId)
    if (enabled && preset && preset.statPoints !== null) {
      const next = [...baseStats]
      next[index] = preset.statPoints
      setBaseStats(next)
      setBaseLevel(levelFromStats(next))
    }
  }

  /** Edicion manual y libre del valor de un stat (independiente del checkbox). */
  function handleStatValueChange(index: number, rawValue: number) {
    const next = [...baseStats]
    next[index] = Number.isFinite(rawValue) ? rawValue : 0
    setBaseStats(next)
    setBaseLevel(levelFromStats(next))
  }

  function handleColorPreset(id: string) {
    setColorPresetId(id)
    const preset = presets.colorPresets.find((p) => p.id === id)
    if (!preset || preset.colors === null) return
    setRegionColors([...preset.colors])
  }

  function handleRegionColor(region: number, colorId: number) {
    setRegionColors((prev) => {
      const next = [...prev]
      next[region] = colorId
      return next
    })
    setColorPresetId('custom')
  }

  function handleReset() {
    setFilter('All')
    setCreature(defaultCreature())
    setEnabledStats([...DEFAULT_ENABLED_STATS])
    setLevelPresetId(DEFAULT_PRESET)
    const preset = presets.levelPresets.find((p) => p.id === DEFAULT_PRESET)
    if (preset && preset.statPoints !== null) {
      const stats = statsFromMask(preset.statPoints, DEFAULT_ENABLED_STATS)
      setBaseStats(stats)
      setBaseLevel(levelFromStats(stats))
    }
    setDinoName('Generated')
    handleColorPreset(DEFAULT_COLOR_PRESET)
    setSaddleId('')
    setSaddleQuality(0)
    setExtraLevels(0)
    setAddedStats([...EMPTY_STATS])
    setCloned(false)
    setNeutered(false)
    setImprintQuality(0)
    setImprinterName('')
    setImprinterPlayerId(0)
    setTamedOn('')
    setUploadedFrom('')
    setDinoId(0)
    setExp(0)
    setSpawnDistance(0)
    setYOffset(20)
    setZOffset(20)
    setAdvancedOpen(false)
  }

  const saddle = saddles.find((s) => s.id === saddleId)

  const validation = useMemo(
    () =>
      validateSpawnExact({ baseLevel, baseStats, extraLevels, addedStats, colors: regionColors }, t),
    [baseLevel, baseStats, extraLevels, addedStats, regionColors, t],
  )

  // Vista previa en tiempo real: se recalcula en cada cambio de estado.
  const command = useMemo(() => {
    if (validation.errors.length > 0) return ''
    return buildSpawnExactDinoCommand({
      creature,
      saddleBlueprintPath: saddle?.blueprintPath ?? '',
      saddleQuality,
      baseLevel,
      extraLevels,
      baseStats,
      addedStats,
      dinoName,
      cloned,
      neutered,
      tamedOn,
      uploadedFrom,
      imprinterName,
      imprinterPlayerId,
      imprintQuality,
      colors: regionColors,
      dinoId,
      exp,
      spawnDistance,
      yOffset,
      zOffset,
      prefix,
    })
  }, [
    creature, saddle, saddleQuality, baseLevel, extraLevels, baseStats, addedStats, dinoName,
    cloned, neutered, tamedOn, uploadedFrom, imprinterName, imprinterPlayerId, imprintQuality,
    regionColors, dinoId, exp, spawnDistance, yOffset, zOffset, prefix, validation.errors.length,
  ])

  const label = `${creature.name} Lv.${baseLevel} "${dinoName || 'Generated'}"`

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display font-bold text-3xl text-bone">{t('exact.title')}</h1>
        <p className="text-bone-dim mt-1">
          {t('exact.subtitleBefore')}{' '}
          <span className="font-mono text-tek-light">SpawnExactDino</span>{' '}
          {t('exact.subtitleAfter')}
        </p>
      </div>

      <div className="panel p-4 flex items-start gap-2 text-xs text-bone-dim">
        <Info size={16} className="text-tek-light shrink-0 mt-0.5" />
        <p>
          {t('exact.warning')}
        </p>
      </div>

      <div className="panel p-5 space-y-5">
        <PrefixToggle value={prefix} onChange={handlePrefix} />

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

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">{t('exact.levelPreset')}</label>
            <select
              className="field-input"
              value={levelPresetId}
              onChange={(e) => handleLevelPreset(e.target.value)}
            >
              {presets.levelPresets.map((p) => (
                <option key={p.id} value={p.id}>
                  {tx(`preset.level.${p.id}.label`, p.label)}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-bone-faint mt-1">
              {tx(
                `preset.level.${levelPresetId}.desc`,
                presets.levelPresets.find((p) => p.id === levelPresetId)?.description ?? '',
              )}
            </p>
          </div>

          <div>
            <label className="field-label">{t('common.level')}</label>
            <input
              type="number"
              min={1}
              className="field-input"
              value={baseLevel}
              onChange={(e) => {
                setBaseLevel(Number(e.target.value))
                setLevelPresetId('custom')
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="field-label mb-0">{t('exact.statsToMax')}</label>
            <span className="text-[11px] text-bone-faint">
              {t('exact.statsHint', {
                points: presets.levelPresets.find((p) => p.id === levelPresetId)?.statPoints ?? '—',
              })}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {STAT_ORDER.slice(0, WILD_STAT_COUNT).map((stat, i) => (
              <div
                key={stat}
                className={`flex items-center gap-2 border rounded-md px-2.5 py-2 transition-colors ${
                  enabledStats[i]
                    ? 'bg-surface-raised border-rust/60'
                    : 'bg-ink border-surface-line'
                }`}
              >
                <input
                  type="checkbox"
                  checked={enabledStats[i]}
                  onChange={(e) => handleStatToggle(i, e.target.checked)}
                  className="accent-rust w-3.5 h-3.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span
                    className={`block text-[11px] truncate ${
                      enabledStats[i] ? 'text-bone' : 'text-bone-faint'
                    }`}
                  >
                    {tx(`stat.${stat}`, stat)}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={baseStats[i]}
                    onChange={(e) => handleStatValueChange(i, Number(e.target.value))}
                    className="field-input py-1 px-2 text-sm mt-0.5"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-bone-faint mt-2">
            {t('exact.statsHelp')}
          </p>
        </div>

        <div>
          <label className="field-label">{t('exact.dinoName')}</label>
          <input
            className="field-input"
            value={dinoName}
            placeholder="Generated"
            onChange={(e) => setDinoName(e.target.value)}
          />
          <p className="text-[11px] text-bone-faint mt-1">
            {t('exact.dinoNameHintBefore')} <span className="font-mono">"Generated"</span>
            {t('exact.dinoNameHintAfter')}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="field-label mb-0">{t('exact.colors')}</label>
            <span className="text-[11px] text-bone-faint">
              {t('exact.colorsHint')}
            </span>
          </div>

          <select
            className="field-input mb-3"
            value={colorPresetId}
            onChange={(e) => handleColorPreset(e.target.value)}
          >
            {presets.colorPresets.map((p) => (
              <option key={p.id} value={p.id}>
                {tx(`preset.color.${p.id}.label`, p.label)}
              </option>
            ))}
          </select>

          <div className="grid sm:grid-cols-2 gap-3">
            {Array.from({ length: COLOR_REGION_COUNT }, (_, region) => (
              <ColorPicker
                key={region}
                colors={colors}
                region={region}
                value={regionColors[region]}
                onChange={(id) => handleRegionColor(region, id)}
              />
            ))}
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className="flex items-center gap-1 text-sm font-display font-semibold text-bone-dim hover:text-bone"
          >
            {advancedOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            {t('exact.advanced')}
          </button>

          {advancedOpen && (
            <div className="mt-4 space-y-5 border-t border-surface-line pt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">{t('exact.saddle')}</label>
                  <select
                    className="field-input"
                    value={saddleId}
                    onChange={(e) => setSaddleId(e.target.value)}
                  >
                    <option value="">{t('exact.noSaddle')}</option>
                    {saddles.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label">{t('exact.saddleQuality')}</label>
                  <input
                    type="number"
                    min={0}
                    className="field-input"
                    value={saddleQuality}
                    onChange={(e) => setSaddleQuality(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="field-label">{t('exact.baseStats')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STAT_ORDER.map((stat, i) => (
                    <div key={stat}>
                      <span className="block text-[11px] text-bone-faint mb-1">
                        {tx(`stat.${stat}`, stat)}
                      </span>
                      <input
                        type="number"
                        min={0}
                        className="field-input"
                        value={baseStats[i]}
                        onChange={(e) => {
                          const next = [...baseStats]
                          next[i] = Number(e.target.value)
                          setBaseStats(next)
                          setLevelPresetId('custom')
                        }}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn-ghost text-xs px-2 py-1 mt-2"
                  onClick={() => setBaseLevel(levelFromStats(baseStats))}
                >
                  {t('exact.adjustLevel', { level: levelFromStats(baseStats) })}
                </button>
              </div>

              <div>
                <label className="field-label">{t('exact.addedStats')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STAT_ORDER.map((stat, i) => (
                    <div key={stat}>
                      <span className="block text-[11px] text-bone-faint mb-1">
                        {tx(`stat.${stat}`, stat)}
                      </span>
                      <input
                        type="number"
                        min={0}
                        className="field-input"
                        value={addedStats[i]}
                        onChange={(e) => {
                          const next = [...addedStats]
                          next[i] = Number(e.target.value)
                          setAddedStats(next)
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="field-label">{t('exact.extraLevels')}</label>
                  <input
                    type="number"
                    min={0}
                    className="field-input"
                    value={extraLevels}
                    onChange={(e) => setExtraLevels(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="field-label">{t('exact.imprint')}</label>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    className="field-input"
                    value={imprintQuality}
                    onChange={(e) => setImprintQuality(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="field-label">{t('exact.imprinterId')}</label>
                  <input
                    type="number"
                    min={0}
                    className="field-input"
                    value={imprinterPlayerId}
                    onChange={(e) => setImprinterPlayerId(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="field-label">{t('exact.imprinterName')}</label>
                  <input
                    className="field-input"
                    value={imprinterName}
                    onChange={(e) => setImprinterName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">{t('exact.tamedOn')}</label>
                  <input
                    className="field-input"
                    value={tamedOn}
                    onChange={(e) => setTamedOn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">{t('exact.uploadedFrom')}</label>
                  <input
                    className="field-input"
                    value={uploadedFrom}
                    onChange={(e) => setUploadedFrom(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">{t('exact.dinoId')}</label>
                  <input
                    type="number"
                    min={0}
                    className="field-input"
                    value={dinoId}
                    onChange={(e) => setDinoId(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="field-label">{t('exact.exp')}</label>
                  <input
                    type="number"
                    min={0}
                    className="field-input"
                    value={exp}
                    onChange={(e) => setExp(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="field-label">{t('exact.spawnDistance')}</label>
                  <input
                    type="number"
                    className="field-input"
                    value={spawnDistance}
                    onChange={(e) => setSpawnDistance(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="field-label">{t('exact.yOffset')}</label>
                  <input
                    type="number"
                    className="field-input"
                    value={yOffset}
                    onChange={(e) => setYOffset(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="field-label">{t('exact.zOffset')}</label>
                  <input
                    type="number"
                    className="field-input"
                    value={zOffset}
                    onChange={(e) => setZOffset(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm text-bone-dim cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={cloned}
                    onChange={(e) => setCloned(e.target.checked)}
                    className="accent-rust w-4 h-4"
                  />
                  {t('exact.cloned')}
                </label>
                <label className="flex items-center gap-2 text-sm text-bone-dim cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={neutered}
                    onChange={(e) => setNeutered(e.target.checked)}
                    className="accent-rust w-4 h-4"
                  />
                  {t('exact.neutered')}
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {validation.warnings.length > 0 && (
        <div className="panel p-4 space-y-1">
          {validation.warnings.map((w, i) => (
            <p key={i} className="text-xs text-bone-dim">
              ⚠ {w}
            </p>
          ))}
        </div>
      )}

      <CommandPreview
        commands={command ? [command] : []}
        errors={validation.errors}
        favoriteActive={isFavorite(command, favorites)}
        onFavoriteToggle={() => setFavorites(toggleFavorite({ label, command }))}
        onReset={handleReset}
        onCopied={() => pushHistory({ label, command })}
      />
    </div>
  )
}
