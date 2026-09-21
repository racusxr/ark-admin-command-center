import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, TerminalSquare } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import type { TKey } from '../i18n/translations'
import LanguageToggle from './LanguageToggle'

const NAV_ITEMS: { to: string; labelKey: TKey }[] = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/spawn-exact', labelKey: 'nav.spawnExact' },
  { to: '/spawn', labelKey: 'nav.spawn' },
  { to: '/items', labelKey: 'nav.items' },
  { to: '/creatures', labelKey: 'nav.creatures' },
  { to: '/commands', labelKey: 'nav.commands' },
  { to: '/custom-caves', labelKey: 'nav.customCaves' },
  { to: '/search', labelKey: 'nav.search' },
  { to: '/history', labelKey: 'nav.history' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  return (
    <header className="sticky top-0 z-30 bg-ink/95 backdrop-blur border-b border-surface-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        <NavLink to="/" className="flex items-center gap-2 group min-w-0" onClick={() => setOpen(false)}>
          <TerminalSquare className="text-rust-light group-hover:text-rust transition-colors shrink-0" size={26} />
          <span className="font-display font-bold text-lg tracking-wide text-bone truncate">
            ARK <span className="text-rust-light">Command Center</span>
          </span>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `px-2.5 py-2 rounded-md text-sm font-display font-semibold tracking-wide transition-colors whitespace-nowrap ${
                  isActive ? 'text-rust-light bg-surface-raised' : 'text-bone-dim hover:text-bone'
                }`
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          <LanguageToggle />
          <button
            className="lg:hidden text-bone-dim hover:text-bone p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-surface-line px-4 py-2 flex flex-col">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-3 rounded-md text-base font-display font-semibold tracking-wide ${
                  isActive ? 'text-rust-light bg-surface-raised' : 'text-bone-dim'
                }`
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
