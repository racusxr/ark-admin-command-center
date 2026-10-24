import { useEffect, useState } from 'react'
import { Star, Trash2 } from 'lucide-react'
import type { HistoryEntry } from '../types'
import CopyButton from '../components/CopyButton'
import { useI18n } from '../i18n/I18nContext'
import type { Lang } from '../i18n/translations'
import type { TFn } from '../i18n/I18nContext'
import {
  clearHistory,
  getFavorites,
  getHistory,
  removeFavorite,
  removeHistoryEntry,
} from '../utils/storage'

function formatTime(ts: number, lang: Lang, t: TFn): string {
  const locale = lang === 'es' ? 'es' : 'en-US'
  const date = new Date(ts)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  const time = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  return isToday
    ? t('history.today', { time })
    : `${date.toLocaleDateString(locale)} ${time}`
}

function EntryRow({
  entry,
  onDelete,
}: {
  entry: HistoryEntry
  onDelete: (id: string) => void
}) {
  const { lang, t } = useI18n()
  return (
    <div className="panel p-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-bone font-display font-semibold truncate">{entry.label}</p>
        <p className="text-xs text-bone-faint">{formatTime(entry.timestamp, lang, t)}</p>
        <pre className="text-xs font-mono text-tek-light mt-1 truncate">{entry.command}</pre>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <CopyButton text={entry.command} label={t('common.copy')} variant="secondary" className="text-xs px-2.5 py-1.5" />
        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          className="btn-ghost text-xs px-2.5 py-1.5 text-danger hover:bg-danger/10"
          aria-label={t('common.delete')}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function History() {
  const { t } = useI18n()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [favorites, setFavorites] = useState<HistoryEntry[]>([])

  useEffect(() => {
    setHistory(getHistory())
    setFavorites(getFavorites())
  }, [])

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display font-bold text-3xl text-bone">{t('history.title')}</h1>
        <p className="text-bone-dim mt-1">{t('history.subtitle')}</p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-rust-light" />
          <h2 className="font-display font-semibold text-bone-dim text-sm tracking-wide">
            {t('history.favorites')}
          </h2>
        </div>
        {favorites.length === 0 ? (
          <p className="text-sm text-bone-faint">{t('history.noFavorites')}</p>
        ) : (
          <div className="space-y-2">
            {favorites.map((f) => (
              <EntryRow
                key={f.id}
                entry={f}
                onDelete={(id) => setFavorites(removeFavorite(id))}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-bone-dim text-sm tracking-wide">
            {t('history.recent')}
          </h2>
          {history.length > 0 && (
            <button
              type="button"
              className="text-xs text-danger hover:underline"
              onClick={() => setHistory(clearHistory())}
            >
              {t('history.clear')}
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-bone-faint">
            {t('history.empty')}
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <EntryRow
                key={h.id}
                entry={h}
                onDelete={(id) => setHistory(removeHistoryEntry(id))}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
