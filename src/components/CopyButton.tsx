import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { copyToClipboard } from '../utils/clipboard'
import { useI18n } from '../i18n/I18nContext'

interface CopyButtonProps {
  text: string
  label?: string
  copiedLabel?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  onCopied?: () => void
  className?: string
}

export default function CopyButton({
  text,
  label,
  copiedLabel,
  variant = 'primary',
  onCopied,
  className = '',
}: CopyButtonProps) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  async function handleClick() {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      onCopied?.()
      setTimeout(() => setCopied(false), 1800)
    }
  }

  const base =
    variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-ghost'

  return (
    <button type="button" onClick={handleClick} className={`${base} ${className}`} disabled={!text}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? (copiedLabel ?? t('common.copied')) : (label ?? t('common.copyCommand'))}
    </button>
  )
}
