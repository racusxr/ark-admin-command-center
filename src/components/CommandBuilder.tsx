import { useEffect, useMemo, useState } from 'react'
import type { CommandDef, Creature, Item } from '../types'
import creaturesData from '../data/creatures.json'
import itemsData from '../data/items.json'
import CreatureSelector from './CreatureSelector'
import ItemSelector from './ItemSelector'
import CommandPreview from './CommandPreview'
import { buildGenericCommand } from '../utils/commandGenerator'
import { getFavorites, isFavorite, pushHistory, toggleFavorite } from '../utils/storage'
import { useI18n } from '../i18n/I18nContext'

const creatures = creaturesData as Creature[]
const items = itemsData as Item[]

interface CommandBuilderProps {
  commands: CommandDef[]
}

export default function CommandBuilder({ commands }: CommandBuilderProps) {
  const { t } = useI18n()
  const [commandId, setCommandId] = useState(commands[0]?.id ?? '')
  const [values, setValues] = useState<Record<string, string>>({})
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [favorites, setFavorites] = useState(getFavorites())

  const command = commands.find((c) => c.id === commandId) ?? commands[0]

  useEffect(() => {
    // Reset form state whenever the chosen command changes.
    const defaults: Record<string, string> = {}
    command?.params.forEach((p) => {
      if (p.default !== undefined) defaults[p.name] = String(p.default)
    })
    setValues(defaults)
    setSelectedCreature(null)
    setSelectedItem(null)
  }, [commandId]) // eslint-disable-line react-hooks/exhaustive-deps

  const resolvedValues = useMemo(() => {
    if (!command) return {}
    const next = { ...values }
    command.params.forEach((p) => {
      if (p.type === 'creature' && selectedCreature) {
        next[p.name] =
          p.name === 'ClassName' ? selectedCreature.className : selectedCreature.blueprintPath
      }
      if (p.type === 'item' && selectedItem) {
        next[p.name] = selectedItem.blueprintPath
      }
    })
    return next
  }, [command, values, selectedCreature, selectedItem])

  const missingRequired = command?.params.some((p) => {
    if (p.optional) return false
    if (p.type === 'creature') return !selectedCreature
    if (p.type === 'item') return !selectedItem
    return !resolvedValues[p.name] && resolvedValues[p.name] !== '0'
  })

  const generated = command && !missingRequired ? buildGenericCommand(command, resolvedValues) : ''
  const favoriteActive = isFavorite(generated, favorites)

  function handleFavoriteToggle() {
    if (!command || !generated) return
    setFavorites(toggleFavorite({ label: command.name, command: generated }))
  }

  function handleCopied() {
    if (!command || !generated) return
    pushHistory({ label: command.name, command: generated })
  }

  if (!command) return null

  return (
    <div className="panel p-5 space-y-4">
      <div>
        <label className="field-label">{t('common.command')}</label>
        <select
          className="field-input"
          value={commandId}
          onChange={(e) => setCommandId(e.target.value)}
        >
          {commands.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-bone-faint mt-1.5">{command.description}</p>
      </div>

      {command.params.map((p) => {
        if (p.type === 'creature') {
          return (
            <CreatureSelector
              key={p.name}
              creatures={creatures}
              value={selectedCreature}
              onChange={setSelectedCreature}
            />
          )
        }
        if (p.type === 'item') {
          return (
            <ItemSelector key={p.name} items={items} value={selectedItem} onChange={setSelectedItem} />
          )
        }
        if (p.type === 'boolean') {
          return (
            <label
              key={p.name}
              className="flex items-center gap-2 text-sm text-bone-dim cursor-pointer select-none"
            >
              <input
                type="checkbox"
                className="accent-rust w-4 h-4"
                checked={values[p.name] === 'true'}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [p.name]: e.target.checked ? 'true' : 'false' }))
                }
              />
              {p.name} — {p.description}
            </label>
          )
        }
        return (
          <div key={p.name}>
            <label className="field-label">{p.name}</label>
            <input
              type={p.type === 'number' ? 'number' : 'text'}
              className="field-input"
              value={values[p.name] ?? ''}
              placeholder={p.description}
              onChange={(e) => setValues((v) => ({ ...v, [p.name]: e.target.value }))}
            />
          </div>
        )
      })}

      <CommandPreview
        commands={generated ? [generated] : []}
        favoriteActive={favoriteActive}
        onFavoriteToggle={generated ? handleFavoriteToggle : undefined}
        onCopied={handleCopied}
      />
    </div>
  )
}
