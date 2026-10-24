import { useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import SearchBar from '../components/SearchBar'
import CommandCard from '../components/CommandCard'
import CommandBuilder from '../components/CommandBuilder'
import { matches } from '../utils/search'
import { useI18n } from '../i18n/I18nContext'
import { useCommands } from '../i18n/commands'

const CATEGORIES = ['All', 'Spawning', 'Player', 'World', 'Cheats', 'Server']

export default function Commands() {
  const { t, tx } = useI18n()
  const commands = useCommands()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    return commands.filter((c) => {
      const inCategory = category === 'All' || c.category === category
      const inQuery = matches(query, c.name, c.description)
      return inCategory && inQuery
    })
  }, [commands, query, category])

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display font-bold text-3xl text-bone">{t('commands.title')}</h1>
        <p className="text-bone-dim mt-1">
          {t('commands.subtitle')}
        </p>
      </div>

      <section>
        <h2 className="font-display font-semibold text-bone-dim text-sm tracking-wide mb-3">
          {t('commands.builder')}
        </h2>
        <CommandBuilder commands={commands} />
      </section>

      <section className="space-y-4">
        <h2 className="font-display font-semibold text-bone-dim text-sm tracking-wide">
          {t('commands.reference')}
        </h2>
        <SearchBar value={query} onChange={setQuery} placeholder={t('commands.search')} />
        <FilterBar
          options={CATEGORIES}
          active={category}
          onChange={setCategory}
          renderLabel={(o) => tx(`cat.${o}`, o)}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <CommandCard key={c.id} command={c} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-bone-faint text-sm">{t('commands.none')}</p>
        )}
      </section>
    </div>
  )
}
