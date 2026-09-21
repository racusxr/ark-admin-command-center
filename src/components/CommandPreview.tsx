import CopyButton from './CopyButton'
import FavoriteButton from './FavoriteButton'
import { RotateCcw } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'

interface CommandPreviewProps {
  title?: string
  commands: string[]
  favoriteActive?: boolean
  onFavoriteToggle?: () => void
  onReset?: () => void
  onCopied?: () => void
  errors?: string[]
}

export default function CommandPreview({
  title,
  commands,
  favoriteActive,
  onFavoriteToggle,
  onReset,
  onCopied,
  errors = [],
}: CommandPreviewProps) {
  const { t } = useI18n()
  const hasCommands = commands.length > 0 && commands.every(Boolean)
  const joined = commands.join('\n')

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-bone tracking-wide">{title ?? t('common.generated')}</h3>
        {commands.length > 1 && (
          <span className="badge bg-tek-dim text-tek-light">{t('common.commandsCount', { count: commands.length })}</span>
        )}
      </div>

      {errors.length > 0 && (
        <div className="mb-3 space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-danger">
              {err}
            </p>
          ))}
        </div>
      )}

      {hasCommands ? (
        <div className="space-y-2 mb-4">
          {commands.map((cmd, i) => (
            <pre key={i} className="code-box whitespace-pre-wrap">
              {cmd}
            </pre>
          ))}
        </div>
      ) : (
        <div className="code-box mb-4 text-bone-faint">
          {t('common.fillFields')}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <CopyButton
          text={joined}
          label={commands.length > 1 ? t('common.copyAll') : t('common.copyCommand')}
          copiedLabel={t('common.copiedCheck')}
          onCopied={onCopied}
        />
        {onFavoriteToggle && (
          <FavoriteButton active={!!favoriteActive} onToggle={onFavoriteToggle} />
        )}
        {onReset && (
          <button type="button" className="btn-ghost" onClick={onReset}>
            <RotateCcw size={16} />
            {t('common.reset')}
          </button>
        )}
      </div>
    </div>
  )
}
