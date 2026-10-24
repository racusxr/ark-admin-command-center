import { Search } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export default function SearchBar({
  value,
  onChange,
  placeholder,
  autoFocus,
}: SearchBarProps) {
  const { t } = useI18n()
  return (
    <div className="relative">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-bone-faint"
        size={20}
      />
      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t('search.placeholder')}
        className="w-full rounded-lg bg-surface border border-surface-line pl-12 pr-4 py-4 text-base text-bone placeholder:text-bone-faint focus:border-rust outline-none transition-colors shadow-panel"
      />
    </div>
  )
}
