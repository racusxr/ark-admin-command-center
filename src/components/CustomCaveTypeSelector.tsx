import { Radio, Shirt, Droplets, type LucideIcon } from 'lucide-react'
import type { CustomCaveObjectDef, CustomCaveType } from '../types'
import { useI18n } from '../i18n/I18nContext'

const ICONS: Record<string, LucideIcon> = { Radio, Shirt, Droplets }

interface CustomCaveTypeSelectorProps {
  objects: CustomCaveObjectDef[]
  value: CustomCaveType
  onChange: (type: CustomCaveType) => void
}

export default function CustomCaveTypeSelector({
  objects,
  value,
  onChange,
}: CustomCaveTypeSelectorProps) {
  const { t, tx } = useI18n()

  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {objects.map((obj) => {
        const Icon = ICONS[obj.icon] ?? Radio
        const active = obj.type === value
        return (
          <button
            key={obj.type}
            type="button"
            onClick={() => onChange(obj.type)}
            aria-pressed={active}
            className={`text-left panel p-4 transition-colors ${
              active
                ? 'border-rust ring-1 ring-rust/40 bg-surface-raised'
                : 'hover:border-rust/60'
            }`}
          >
            <Icon size={22} className={active ? 'text-rust-light' : 'text-bone-dim'} />
            <h3
              className={`font-display font-semibold mt-2 ${
                active ? 'text-rust-light' : 'text-bone'
              }`}
            >
              {tx(`cave.type.${obj.type}.name`, obj.type)}
            </h3>
            <p className="text-xs text-bone-dim mt-1">
              {tx(`cave.type.${obj.type}.desc`, '')}
            </p>
            {!obj.verified && (
              <p className="text-[11px] text-danger mt-2">{t('cave.pending')}</p>
            )}
          </button>
        )
      })}
    </div>
  )
}
