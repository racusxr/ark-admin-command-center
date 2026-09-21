import { Globe } from 'lucide-react'
import { LANGS, type Lang } from '../i18n/translations'
import { useI18n } from '../i18n/I18nContext'

/** Interruptor ES | EN. El idioma elegido se guarda en localStorage. */
export default function LanguageToggle() {
  const { lang, setLang, t } = useI18n()

  return (
    <div
      role="group"
      aria-label={t('lang.label')}
      className="inline-flex items-center gap-1 rounded-md border border-surface-line bg-ink p-0.5 sm:pl-2"
    >
      <Globe size={14} className="hidden sm:block text-bone-faint shrink-0" aria-hidden="true" />
      {LANGS.map((code: Lang) => {
        const active = lang === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            aria-label={code === 'es' ? t('lang.switchToEs') : t('lang.switchToEn')}
            className={`px-1.5 sm:px-2 py-1 rounded text-xs font-display font-bold tracking-wider transition-colors ${
              active ? 'bg-rust text-ink' : 'text-bone-dim hover:text-bone'
            }`}
          >
            {code.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
