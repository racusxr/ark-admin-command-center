import { Link } from 'react-router-dom'
import { Skull, Package, Wand2, ListTree, Sparkles, History as HistoryIcon } from 'lucide-react'
import { getHistory, getFavorites } from '../utils/storage'
import { useEffect, useState } from 'react'
import type { HistoryEntry } from '../types'
import CopyButton from '../components/CopyButton'
import { useI18n } from '../i18n/I18nContext'
import type { TKey } from '../i18n/translations'

const QUICK_LINKS: { to: string; titleKey: TKey; descKey: TKey; icon: typeof Sparkles }[] = [
  { to: '/spawn-exact', titleKey: 'home.quick.exact.title', descKey: 'home.quick.exact.desc', icon: Sparkles },
  { to: '/spawn', titleKey: 'home.quick.spawn.title', descKey: 'home.quick.spawn.desc', icon: Skull },
  { to: '/items', titleKey: 'home.quick.items.title', descKey: 'home.quick.items.desc', icon: Package },
  { to: '/commands', titleKey: 'home.quick.commands.title', descKey: 'home.quick.commands.desc', icon: Wand2 },
  { to: '/creatures', titleKey: 'home.quick.creatures.title', descKey: 'home.quick.creatures.desc', icon: ListTree },
]

export default function Home() {
  const { t } = useI18n()
  const [recent, setRecent] = useState<HistoryEntry[]>([])
  const [favCount, setFavCount] = useState(0)

  useEffect(() => {
    setRecent(getHistory().slice(0, 3))
    setFavCount(getFavorites().length)
  }, [])

  return (
    <div className="space-y-12">
      <section className="pt-6 sm:pt-10">
        <p className="font-mono text-xs text-tek-light tracking-widest mb-3">
          admincheat // command generator
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-bone leading-tight max-w-2xl">
          {t('home.titleBefore')} <span className="text-rust-light">ARK: Survival Evolved</span>{' '}
          {t('home.titleAfter')}
        </h1>
        <p className="mt-4 text-bone-dim max-w-xl">
          {t('home.intro')}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/spawn-exact" className="btn-primary">
            {t('home.cta.exact')}
          </Link>
          <Link to="/spawn" className="btn-secondary">
            {t('home.cta.spawn')}
          </Link>
          <Link to="/items" className="btn-secondary">
            {t('home.cta.item')}
          </Link>
        </div>
      </section>

      <section>
        <div className="grid sm:grid-cols-2 gap-4">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="panel p-5 hover:border-rust/60 transition-colors group"
            >
              <link.icon className="text-rust-light mb-3" size={22} />
              <h3 className="font-display font-semibold text-bone group-hover:text-rust-light transition-colors">
                {t(link.titleKey)}
              </h3>
              <p className="text-sm text-bone-dim mt-1">{t(link.descKey)}</p>
            </Link>
          ))}
        </div>
      </section>

      {(recent.length > 0 || favCount > 0) && (
        <section className="grid sm:grid-cols-2 gap-6">
          {recent.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <HistoryIcon size={16} className="text-bone-faint" />
                <h2 className="font-display font-semibold text-bone-dim text-sm tracking-wide">
                  {t('home.recent')}
                </h2>
              </div>
              <div className="space-y-2">
                {recent.map((h) => (
                  <div key={h.id} className="panel p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-bone truncate">{h.label}</p>
                      <p className="text-xs text-bone-faint font-mono truncate">{h.command}</p>
                    </div>
                    <CopyButton text={h.command} label={t('common.copy')} className="shrink-0" />
                  </div>
                ))}
              </div>
              <Link to="/history" className="text-sm text-tek-light hover:underline mt-2 inline-block">
                {t('home.viewHistory')}
              </Link>
            </div>
          )}

          {favCount > 0 && (
            <div>
              <h2 className="font-display font-semibold text-bone-dim text-sm tracking-wide mb-3">
                {t('home.favorites')}
              </h2>
              <p className="text-sm text-bone-dim">
                {t(favCount === 1 ? 'home.favCount.one' : 'home.favCount.other', { count: favCount })}
              </p>
              <Link to="/history" className="text-sm text-tek-light hover:underline mt-2 inline-block">
                {t('home.viewFavorites')}
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
