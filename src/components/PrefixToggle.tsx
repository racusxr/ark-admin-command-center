import type { CheatPrefix } from '../types'
import { useI18n } from '../i18n/I18nContext'

interface PrefixToggleProps {
  value: CheatPrefix
  onChange: (prefix: CheatPrefix) => void
}

/**
 * ARK acepta `cheat` (single player / ya autenticado) y `admincheat` (servidor).
 * La eleccion se guarda en localStorage y afecta a todos los comandos generados.
 */
export default function PrefixToggle({ value, onChange }: PrefixToggleProps) {
  const { t } = useI18n()
  return (
    <div>
      <label className="field-label">{t('common.commandPrefix')}</label>
      <div className="flex flex-wrap gap-2">
        {(['cheat', 'admincheat'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`px-3 py-1.5 rounded-md text-sm font-mono border transition-colors ${
              value === p
                ? 'bg-tek text-ink border-tek'
                : 'bg-ink text-bone-dim border-surface-line hover:border-tek/60'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
