import type { CommandDef } from '../types'
import CopyButton from './CopyButton'
import { useI18n } from '../i18n/I18nContext'

interface CommandCardProps {
  command: CommandDef
}

const CATEGORY_COLORS: Record<string, string> = {
  Spawning: 'bg-rust-dim text-rust-light',
  Player: 'bg-moss-dim text-moss-light',
  World: 'bg-tek-dim text-tek-light',
  Cheats: 'bg-surface-raised text-bone-dim',
  Server: 'bg-surface-raised text-bone-dim',
}

export default function CommandCard({ command }: CommandCardProps) {
  const { t, tx } = useI18n()
  return (
    <div className="panel p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-bold text-lg text-bone">{command.name}</h3>
        <span className={`badge ${CATEGORY_COLORS[command.category] ?? 'bg-surface-raised text-bone-dim'}`}>
          {tx(`cat.${command.category}`, command.category)}
        </span>
      </div>

      <p className="text-sm text-bone-dim">{command.description}</p>

      <div>
        <p className="text-xs font-display font-semibold tracking-wide text-bone-faint mb-1">
          {t('card.syntax')}
        </p>
        <pre className="code-box whitespace-pre-wrap">{command.syntax}</pre>
      </div>

      {command.params.length > 0 && (
        <div>
          <p className="text-xs font-display font-semibold tracking-wide text-bone-faint mb-1">
            {t('card.params')}
          </p>
          <ul className="text-sm text-bone-dim space-y-1">
            {command.params.map((p) => (
              <li key={p.name}>
                <span className="text-bone font-mono text-xs">{p.name}</span> — {p.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-xs font-display font-semibold tracking-wide text-bone-faint mb-1">
          {t('card.example')}
        </p>
        <pre className="code-box whitespace-pre-wrap">{command.example}</pre>
      </div>

      <CopyButton text={command.example} className="self-start" />
    </div>
  )
}
