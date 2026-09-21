import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, ChevronRight, Info, RotateCcw } from 'lucide-react'
import customCavesData from '../data/customCaves.json'
import type {
  CheatPrefix,
  CustomCaveConfig,
  CustomCaveMode,
  CustomCaveObjectDef,
  CustomCaveType,
} from '../types'
import CustomCaveTypeSelector from '../components/CustomCaveTypeSelector'
import CommandPreview from '../components/CommandPreview'
import PrefixToggle from '../components/PrefixToggle'
import {
  buildCustomCaveCommand,
  customCaveGridTotal,
  GRID_WARNING_THRESHOLD,
  validateCustomCave,
} from '../utils/customCaveCommand'
import { buildPixelTextCommand } from '../utils/pixelTextCommand'
import {
  getCheatPrefix,
  getFavorites,
  isFavorite,
  pushHistory,
  setCheatPrefix,
  toggleFavorite,
} from '../utils/storage'
import { useI18n } from '../i18n/I18nContext'

const objects = customCavesData as CustomCaveObjectDef[]

const DISTANCE_PRESETS: { id: string; distance: number }[] = [
  { id: 'low', distance: 100 },
  { id: 'medium', distance: 300 },
  { id: 'high', distance: 600 },
]

const MODES: CustomCaveMode[] = ['single', 'grid', 'text']

function defaultObject(): CustomCaveObjectDef {
  return objects[0]
}

function defaultConfig(type: CustomCaveType): CustomCaveConfig {
  const def = objects.find((o) => o.type === type) ?? defaultObject()
  return {
    type: def.type,
    variantId: def.variants?.[0]?.id,
    name: 'Custom Cave',
    mode: 'single',
    spawnDistance: 300,
    yOffset: 0,
    zOffset: 0,
    width: 1,
    length: 1,
    height: 1,
    spacingX: 200,
    spacingY: 200,
    spacingZ: 200,
    text: '',
    letterGap: 1,
    pitch: 0,
    yaw: 0,
    roll: 0,
    quantity: 1,
    quality: 0,
    blueprint: false,
    prefix: getCheatPrefix(),
  }
}

export default function CustomCaves() {
  const { t, tx } = useI18n()
  const [params, setParams] = useSearchParams()

  const initialType = (params.get('cctype') as CustomCaveType) || defaultObject().type
  const [cfg, setCfg] = useState<CustomCaveConfig>(() => ({
    ...defaultConfig(initialType),
    variantId: params.get('ccvariant') ?? defaultConfig(initialType).variantId,
    name: params.get('ccname') ?? 'Custom Cave',
    mode: (params.get('ccmode') as CustomCaveMode) || 'single',
    spawnDistance: Number(params.get('ccx')) || 300,
    yOffset: Number(params.get('ccy')) || 0,
    zOffset: Number(params.get('ccz')) || 0,
    width: Number(params.get('ccw')) || 1,
    length: Number(params.get('ccl')) || 1,
    height: Number(params.get('cch')) || 1,
    spacingX: Number(params.get('ccsx')) || 200,
    spacingY: Number(params.get('ccsy')) || 200,
    spacingZ: Number(params.get('ccsz')) || 200,
    text: params.get('cctext') ?? '',
    letterGap: Number(params.get('ccgap')) || 1,
    pitch: Number(params.get('ccpitch')) || 0,
    yaw: Number(params.get('ccyaw')) || 0,
    roll: Number(params.get('ccroll')) || 0,
  }))
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [distancePreset, setDistancePreset] = useState('custom')
  const [prefix, setPrefix] = useState<CheatPrefix>(() => getCheatPrefix())
  const [favorites, setFavorites] = useState(getFavorites())

  const def = useMemo(
    () => objects.find((o) => o.type === cfg.type) ?? defaultObject(),
    [cfg.type],
  )

  // Sincroniza la URL para poder compartir la configuracion (no rompe el
  // sistema de URL sharing existente: usa su propio prefijo cc*).
  useEffect(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('cctype', cfg.type)
        if (cfg.variantId) next.set('ccvariant', cfg.variantId)
        else next.delete('ccvariant')
        next.set('ccname', cfg.name)
        next.set('ccmode', cfg.mode)
        next.set('ccx', String(cfg.spawnDistance))
        next.set('ccy', String(cfg.yOffset))
        next.set('ccz', String(cfg.zOffset))
        next.set('ccw', String(cfg.width))
        next.set('ccl', String(cfg.length))
        next.set('cch', String(cfg.height))
        next.set('ccsx', String(cfg.spacingX))
        next.set('ccsy', String(cfg.spacingY))
        next.set('ccsz', String(cfg.spacingZ))
        next.set('cctext', cfg.text)
        next.set('ccgap', String(cfg.letterGap))
        next.set('ccpitch', String(cfg.pitch))
        next.set('ccyaw', String(cfg.yaw))
        next.set('ccroll', String(cfg.roll))
        return next
      },
      { replace: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg])

  function handleTypeChange(type: CustomCaveType) {
    const nextDef = objects.find((o) => o.type === type) ?? defaultObject()
    setCfg((prev) => ({
      ...prev,
      type,
      variantId: nextDef.variants?.[0]?.id,
    }))
    setDistancePreset('custom')
  }

  function handleModeChange(mode: CustomCaveMode) {
    setCfg((prev) => ({ ...prev, mode }))
  }

  function handleDistancePreset(id: string) {
    setDistancePreset(id)
    const preset = DISTANCE_PRESETS.find((p) => p.id === id)
    if (!preset) return // "custom": no toca el valor manual del usuario
    setCfg((prev) => ({ ...prev, spawnDistance: preset.distance }))
  }

  function handlePrefix(p: CheatPrefix) {
    setPrefix(setCheatPrefix(p))
    setCfg((prev) => ({ ...prev, prefix: p }))
  }

  function handleReset() {
    const next = defaultConfig(defaultObject().type)
    setCfg({ ...next, prefix })
    setDistancePreset('custom')
    setAdvancedOpen(false)
  }

  function handleGridDimChange(field: 'width' | 'length' | 'height', raw: string) {
    const n = Math.round(Number(raw))
    setCfg((prev) => ({ ...prev, [field]: Number.isFinite(n) ? Math.max(1, n) : 1 }))
  }

  const validation = useMemo(() => validateCustomCave(def, cfg, t), [def, cfg, t])

  const textResult = useMemo(() => {
    if (def.commandMethod !== 'SpawnActor' || cfg.mode !== 'text') return null
    return buildPixelTextCommand(def, cfg)
  }, [def, cfg])

  const command = useMemo(() => {
    if (validation.errors.length > 0) return ''
    if (cfg.mode === 'text') return textResult?.command ?? ''
    return buildCustomCaveCommand(def, { ...cfg, prefix })
  }, [def, cfg, prefix, validation.errors.length, textResult])

  const extraWarnings = useMemo(() => {
    if (cfg.mode !== 'text' || !textResult) return []
    const w: string[] = []
    if (textResult.unsupported.length > 0) {
      w.push(t('cave.text.unsupported', { chars: textResult.unsupported.join(' ') }))
    }
    if (textResult.total > GRID_WARNING_THRESHOLD) {
      w.push(t('cave.grid.totalWarning', { count: textResult.total }))
    }
    return w
  }, [cfg.mode, textResult, t])

  const gridTotal = useMemo(() => customCaveGridTotal(cfg), [cfg])
  const isGrid = def.commandMethod === 'SpawnActor' && cfg.mode === 'grid' && gridTotal > 1

  const objectLabel = tx(`cave.type.${def.type}.name`, def.type)
  const label =
    cfg.mode === 'text' && cfg.text.trim()
      ? `${cfg.name || 'Custom Cave'} (${objectLabel}: "${cfg.text.trim()}")`
      : `${cfg.name || 'Custom Cave'} (${objectLabel})${isGrid ? ` x${gridTotal}` : ''}`

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display font-bold text-3xl text-bone">{t('cave.title')}</h1>
        <p className="text-bone-dim mt-1">{t('cave.subtitle')}</p>
      </div>

      <div className="panel p-5 space-y-5">
        <PrefixToggle value={prefix} onChange={handlePrefix} />

        <div>
          <label className="field-label">{t('common.configure')}</label>
          <CustomCaveTypeSelector objects={objects} value={cfg.type} onChange={handleTypeChange} />
        </div>

        <div>
          <label className="field-label">{t('cave.customName')}</label>
          <input
            className="field-input"
            value={cfg.name}
            placeholder="Custom Cave"
            onChange={(e) => setCfg((prev) => ({ ...prev, name: e.target.value }))}
          />
          <p className="text-[11px] text-bone-faint mt-1">{t('cave.customNameHint')}</p>
        </div>

        {def.commandMethod === 'SpawnActor' && def.variants && def.variants.length > 0 && (
          <div>
            <label className="field-label">{t('cave.variant')}</label>
            <div className="flex flex-wrap gap-2">
              {def.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setCfg((prev) => ({ ...prev, variantId: v.id }))}
                  className={`px-3 py-1.5 rounded-md text-sm font-display font-semibold border transition-colors ${
                    cfg.variantId === v.id
                      ? 'bg-tek text-ink border-tek'
                      : 'bg-ink text-bone-dim border-surface-line hover:border-tek/60'
                  }`}
                >
                  {tx(`cave.variant.${v.labelKey}`, v.labelKey)}
                </button>
              ))}
            </div>
          </div>
        )}

        {def.commandMethod === 'SpawnActor' ? (
          <>
            <div>
              <label className="field-label">{t('cave.mode')}</label>
              <div className="flex flex-wrap gap-2">
                {MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleModeChange(m)}
                    className={`px-3 py-1.5 rounded-full text-xs font-display font-semibold tracking-wide border transition-colors ${
                      cfg.mode === m
                        ? 'bg-tek text-ink border-tek'
                        : 'bg-surface text-bone-dim border-surface-line hover:border-tek/60 hover:text-bone'
                    }`}
                  >
                    {tx(`cave.mode.${m}`, m)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="field-label mb-0">{t('cave.position')}</label>
              </div>
              <p className="text-[11px] text-bone-faint mb-3">{t('cave.positionHint')}</p>

              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {DISTANCE_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleDistancePreset(p.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-display font-semibold tracking-wide border transition-colors ${
                        distancePreset === p.id
                          ? 'bg-rust text-ink border-rust'
                          : 'bg-surface text-bone-dim border-surface-line hover:border-rust/60 hover:text-bone'
                      }`}
                    >
                      {tx(`cave.preset.${p.id}`, p.id)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setDistancePreset('custom')}
                    className={`px-3 py-1.5 rounded-full text-xs font-display font-semibold tracking-wide border transition-colors ${
                      distancePreset === 'custom'
                        ? 'bg-rust text-ink border-rust'
                        : 'bg-surface text-bone-dim border-surface-line hover:border-rust/60 hover:text-bone'
                    }`}
                  >
                    {tx('cave.preset.custom', 'custom')}
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="field-label">{t('cave.spawnDistance')}</label>
                  <input
                    type="number"
                    step="any"
                    className="field-input"
                    value={cfg.spawnDistance}
                    onChange={(e) => {
                      setCfg((prev) => ({ ...prev, spawnDistance: Number(e.target.value) }))
                      setDistancePreset('custom')
                    }}
                  />
                </div>
                <div>
                  <label className="field-label">{t('cave.yOffset')}</label>
                  <input
                    type="number"
                    step="any"
                    className="field-input"
                    value={cfg.yOffset}
                    onChange={(e) =>
                      setCfg((prev) => ({ ...prev, yOffset: Number(e.target.value) }))
                    }
                  />
                </div>
                <div>
                  <label className="field-label">{t('cave.zOffset')}</label>
                  <input
                    type="number"
                    step="any"
                    className="field-input"
                    value={cfg.zOffset}
                    onChange={(e) =>
                      setCfg((prev) => ({ ...prev, zOffset: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className="btn-ghost text-xs px-2 py-1"
                  onClick={() =>
                    setCfg((prev) => ({ ...prev, spawnDistance: 0, yOffset: 0, zOffset: 0 }))
                  }
                >
                  <RotateCcw size={14} />
                  {t('cave.reset')}
                </button>
              </div>
            </div>

            {cfg.mode === 'grid' && (
              <div>
                <label className="field-label">{t('cave.grid.title')}</label>
                <p className="text-[11px] text-bone-faint mb-3">{t('cave.grid.hint')}</p>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <span className="block text-[11px] text-bone-faint mb-1">
                      {t('cave.grid.width')}
                    </span>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      className="field-input"
                      value={cfg.width}
                      onChange={(e) => handleGridDimChange('width', e.target.value)}
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-bone-faint mb-1">
                      {t('cave.grid.length')}
                    </span>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      className="field-input"
                      value={cfg.length}
                      onChange={(e) => handleGridDimChange('length', e.target.value)}
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-bone-faint mb-1">
                      {t('cave.grid.height')}
                    </span>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      className="field-input"
                      value={cfg.height}
                      onChange={(e) => handleGridDimChange('height', e.target.value)}
                    />
                  </div>
                </div>

                {gridTotal > 1 && (
                  <div className="grid sm:grid-cols-3 gap-4 mt-4">
                    <div>
                      <span className="block text-[11px] text-bone-faint mb-1">
                        {t('cave.grid.spacingX')}
                      </span>
                      <input
                        type="number"
                        step="any"
                        className="field-input"
                        value={cfg.spacingX}
                        onChange={(e) =>
                          setCfg((prev) => ({ ...prev, spacingX: Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-bone-faint mb-1">
                        {t('cave.grid.spacingY')}
                      </span>
                      <input
                        type="number"
                        step="any"
                        className="field-input"
                        value={cfg.spacingY}
                        onChange={(e) =>
                          setCfg((prev) => ({ ...prev, spacingY: Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-bone-faint mb-1">
                        {t('cave.grid.spacingZ')}
                      </span>
                      <input
                        type="number"
                        step="any"
                        className="field-input"
                        value={cfg.spacingZ}
                        onChange={(e) =>
                          setCfg((prev) => ({ ...prev, spacingZ: Number(e.target.value) }))
                        }
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-bone-dim mt-3">
                  {t('cave.grid.total', { count: gridTotal })}
                </p>
              </div>
            )}

            {cfg.mode === 'text' && (
              <div>
                <label className="field-label">{t('cave.text.label')}</label>
                <p className="text-[11px] text-bone-faint mb-3">{t('cave.text.hint')}</p>

                <input
                  className="field-input font-display tracking-widest uppercase"
                  value={cfg.text}
                  maxLength={20}
                  placeholder="R"
                  onChange={(e) => setCfg((prev) => ({ ...prev, text: e.target.value }))}
                />

                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <span className="block text-[11px] text-bone-faint mb-1">
                      {t('cave.grid.spacingY')}
                    </span>
                    <input
                      type="number"
                      step="any"
                      className="field-input"
                      value={cfg.spacingY}
                      onChange={(e) =>
                        setCfg((prev) => ({ ...prev, spacingY: Number(e.target.value) }))
                      }
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-bone-faint mb-1">
                      {t('cave.grid.spacingZ')}
                    </span>
                    <input
                      type="number"
                      step="any"
                      className="field-input"
                      value={cfg.spacingZ}
                      onChange={(e) =>
                        setCfg((prev) => ({ ...prev, spacingZ: Number(e.target.value) }))
                      }
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-bone-faint mb-1">
                      {t('cave.text.letterGap')}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      className="field-input"
                      value={cfg.letterGap}
                      onChange={(e) =>
                        setCfg((prev) => ({
                          ...prev,
                          letterGap: Math.max(0, Math.round(Number(e.target.value)) || 0),
                        }))
                      }
                    />
                  </div>
                </div>

                {textResult && textResult.total > 0 && (
                  <p className="text-xs text-bone-dim mt-3">
                    {t('cave.text.total', { count: textResult.total })}
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="panel bg-ink p-4 flex items-start gap-2 text-xs text-bone-dim">
            <Info size={16} className="text-tek-light shrink-0 mt-0.5" />
            <p>{t('cave.giveItemNote')}</p>
          </div>
        )}

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
            <div className="mt-4 space-y-4 border-t border-surface-line pt-4">
              {def.commandMethod === 'SpawnActor' ? (
                <div>
                  <label className="field-label">{t('cave.rotation')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <span className="block text-[11px] text-bone-faint mb-1">
                        {t('cave.pitch')}
                      </span>
                      <input
                        type="number"
                        step="any"
                        className="field-input"
                        value={cfg.pitch}
                        onChange={(e) =>
                          setCfg((prev) => ({ ...prev, pitch: Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-bone-faint mb-1">
                        {t('cave.yaw')}
                      </span>
                      <input
                        type="number"
                        step="any"
                        className="field-input"
                        value={cfg.yaw}
                        onChange={(e) =>
                          setCfg((prev) => ({ ...prev, yaw: Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-bone-faint mb-1">
                        {t('cave.roll')}
                      </span>
                      <input
                        type="number"
                        step="any"
                        className="field-input"
                        value={cfg.roll}
                        onChange={(e) =>
                          setCfg((prev) => ({ ...prev, roll: Number(e.target.value) }))
                        }
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-bone-faint mt-2">{t('cave.rotationNote')}</p>
                </div>
              ) : (
                <div>
                  <label className="field-label">{t('cave.giveItemOptions')}</label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[11px] text-bone-faint mb-1">
                        {t('common.quantity')}
                      </span>
                      <input
                        type="number"
                        min={1}
                        className="field-input"
                        value={cfg.quantity}
                        onChange={(e) =>
                          setCfg((prev) => ({ ...prev, quantity: Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-bone-faint mb-1">
                        {t('common.quality')}
                      </span>
                      <input
                        type="number"
                        min={0}
                        className="field-input"
                        value={cfg.quality}
                        onChange={(e) =>
                          setCfg((prev) => ({ ...prev, quality: Number(e.target.value) }))
                        }
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-bone-dim cursor-pointer select-none mt-3">
                    <input
                      type="checkbox"
                      checked={cfg.blueprint}
                      onChange={(e) =>
                        setCfg((prev) => ({ ...prev, blueprint: e.target.checked }))
                      }
                      className="accent-rust w-4 h-4"
                    />
                    {t('items.giveBlueprint')}
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {(validation.warnings.length > 0 || extraWarnings.length > 0) && (
        <div className="panel p-4 space-y-1">
          {[...validation.warnings, ...extraWarnings].map((w, i) => (
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
        onFavoriteToggle={
          command ? () => setFavorites(toggleFavorite({ label, command })) : undefined
        }
        onReset={handleReset}
        onCopied={() => command && pushHistory({ label, command })}
      />
    </div>
  )
}
