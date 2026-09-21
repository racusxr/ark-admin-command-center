import { useMemo, useState } from 'react'
import itemsData from '../data/items.json'
import type { CheatPrefix, Item, ItemCategory } from '../types'
import type { ItemCommandType } from '../utils/commandGenerator'
import ItemSelector from '../components/ItemSelector'
import FilterBar from '../components/FilterBar'
import SearchBar from '../components/SearchBar'
import CommandPreview from '../components/CommandPreview'
import CopyButton from '../components/CopyButton'
import PrefixToggle from '../components/PrefixToggle'
import {
  buildGiveItemCommand,
  supportsGiveItemNum,
  validateQuality,
  validateQuantity,
} from '../utils/commandGenerator'
import {
  getCheatPrefix,
  getFavorites,
  isFavorite,
  pushHistory,
  setCheatPrefix,
  toggleFavorite,
} from '../utils/storage'
import { matchesItem, rankByName } from '../utils/search'
import { useI18n } from '../i18n/I18nContext'

const items = itemsData as Item[]

const CATEGORIES: ('All' | ItemCategory)[] = [
  'All', 'Resources', 'Weapons', 'Armor', 'Saddles', 'Structures', 'Consumables',
  'Ammo', 'Tools', 'Artifacts', 'Cosmetics',
]

const MAX_CARDS = 60

export default function Items() {
  const { t, tx } = useI18n()
  const [item, setItem] = useState<Item | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [quality, setQuality] = useState(0)
  const [blueprint, setBlueprint] = useState(false)
  const [commandType, setCommandType] = useState<ItemCommandType>('GiveItem')
  const [category, setCategory] = useState<string>('All')
  const [query, setQuery] = useState('')
  const [prefix, setPrefix] = useState<CheatPrefix>(() => getCheatPrefix())
  const [favorites, setFavorites] = useState(getFavorites())

  const filteredItems = useMemo(() => {
    const byCategory = category === 'All' ? items : items.filter((i) => i.category === category)
    return rankByName(query, byCategory.filter((i) => matchesItem(query, i)))
  }, [category, query])

  const quantityError = validateQuantity(quantity, t)
  const qualityError = validateQuality(quality, t)
  const errors = [quantityError, qualityError].filter((e): e is string => !!e)

  const canUseNum = item ? supportsGiveItemNum(item) : false
  const effectiveType: ItemCommandType = canUseNum ? commandType : 'GiveItem'

  const command = useMemo(() => {
    if (!item || errors.length > 0) return ''
    return buildGiveItemCommand({
      item,
      quantity,
      quality,
      blueprint,
      commandType: effectiveType,
      prefix,
    })
  }, [item, quantity, quality, blueprint, effectiveType, prefix, errors.length])

  const label = item ? `${item.name} x${quantity}` : ''

  function handleReset() {
    setItem(null)
    setQuantity(1)
    setQuality(0)
    setBlueprint(false)
    setCommandType('GiveItem')
  }

  function selectItem(i: Item) {
    setItem(i)
    if (!supportsGiveItemNum(i)) setCommandType('GiveItem')
  }

  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-bone">{t('items.title')}</h1>
          <p className="text-bone-dim mt-1">
            {t('items.subtitle')}
          </p>
        </div>

        <div className="panel p-5 space-y-4">
          <PrefixToggle value={prefix} onChange={(p) => setPrefix(setCheatPrefix(p))} />

          <ItemSelector items={items} value={item} onChange={selectItem} />

          {item && (
            <div className="space-y-1 -mt-2">
              <p className="text-[11px] font-mono text-bone-faint break-all">{item.blueprintPath}</p>
              {!item.verified && (
                <p className="text-[11px] text-bone-dim">
                  {t('items.unverified')}
                </p>
              )}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
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
            <div>
              <label className="field-label">{t('common.quality')}</label>
              <input
                type="number"
                className="field-input"
                value={quality}
                min={0}
                onChange={(e) => setQuality(Number(e.target.value))}
              />
              {qualityError && <p className="text-xs text-danger mt-1">{qualityError}</p>}
            </div>
          </div>

          <div>
            <label className="field-label">{t('items.commandType')}</label>
            <div className="flex flex-wrap gap-2">
              {(['GiveItem', 'GiveItemNum'] as const).map((t) => {
                const disabled = t === 'GiveItemNum' && !canUseNum
                if (disabled) return null
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCommandType(t)}
                    className={`px-3 py-1.5 rounded-md text-sm font-display font-semibold border transition-colors ${
                      effectiveType === t
                        ? 'bg-tek text-ink border-tek'
                        : 'bg-ink text-bone-dim border-surface-line hover:border-tek/60'
                    }`}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
            {item && !canUseNum && (
              <p className="text-[11px] text-bone-faint mt-1">
                {t('items.noNum')}
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-bone-dim cursor-pointer select-none">
            <input
              type="checkbox"
              checked={blueprint}
              onChange={(e) => setBlueprint(e.target.checked)}
              className="accent-rust w-4 h-4"
              disabled={!!item && !item.canBeBlueprint}
            />
            {t('items.giveBlueprint')} {item && !item.canBeBlueprint && t('items.noBlueprint')}
          </label>
        </div>

        <CommandPreview
          commands={command ? [command] : []}
          errors={!item ? [] : errors}
          favoriteActive={isFavorite(command, favorites)}
          onFavoriteToggle={
            item ? () => setFavorites(toggleFavorite({ label, command })) : undefined
          }
          onReset={handleReset}
          onCopied={() => item && pushHistory({ label, command })}
        />
      </div>

      <div>
        <h2 className="font-display font-semibold text-bone-dim text-sm tracking-wide mb-3">
          {t('items.database', { count: items.length })}
        </h2>
        <div className="space-y-3">
          <SearchBar value={query} onChange={setQuery} placeholder={t('items.search')} />
          <FilterBar
            options={CATEGORIES}
            active={category}
            onChange={setCategory}
            renderLabel={(o) => tx(`itemcat.${o}`, o)}
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {filteredItems.slice(0, MAX_CARDS).map((i) => (
            <div key={i.id} className="panel p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold text-bone">{i.name}</h3>
                <span className="badge bg-surface-raised text-bone-dim shrink-0">
                  {tx(`itemcat.${i.category}`, i.category)}
                </span>
              </div>
              <p className="text-[11px] font-mono text-bone-faint break-all">{i.className}</p>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  className="btn-secondary text-xs px-2.5 py-1.5"
                  onClick={() => {
                    selectItem(i)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  {t('common.configure')}
                </button>
                <CopyButton
                  text={buildGiveItemCommand({
                    item: i,
                    quantity: 1,
                    quality: 0,
                    blueprint: false,
                    prefix,
                  })}
                  label={t('common.copy')}
                  variant="ghost"
                  className="text-xs px-2.5 py-1.5"
                />
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length > MAX_CARDS && (
          <p className="text-xs text-bone-faint mt-3">
            {t('items.showing', { shown: MAX_CARDS, total: filteredItems.length })}
          </p>
        )}
        {filteredItems.length === 0 && (
          <p className="text-bone-faint text-sm mt-3">{t('items.none')}</p>
        )}
      </div>
    </div>
  )
}
