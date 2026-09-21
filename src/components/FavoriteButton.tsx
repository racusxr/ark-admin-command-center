import { Star } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'

interface FavoriteButtonProps {
  active: boolean
  onToggle: () => void
  className?: string
}

export default function FavoriteButton({ active, onToggle, className = '' }: FavoriteButtonProps) {
  const { t } = useI18n()
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`btn-secondary ${active ? '!border-rust !text-rust-light' : ''} ${className}`}
    >
      <Star size={16} fill={active ? 'currentColor' : 'none'} />
      {active ? t('common.favorited') : t('common.favorite')}
    </button>
  )
}
