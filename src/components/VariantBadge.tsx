import type { CreatureVariant } from '../types'

const STYLES: Record<string, string> = {
  Normal: 'bg-surface-raised text-bone-dim',
  Tek: 'bg-tek-dim text-tek-light',
  Aberrant: 'bg-moss-dim text-moss-light',
  Alpha: 'bg-danger/30 text-rust-light',
  Boss: 'bg-danger/30 text-rust-light',
  Corrupted: 'bg-moss-dim text-moss-light',
  Brute: 'bg-danger/30 text-rust-light',
  X: 'bg-tek-dim text-tek-light',
  R: 'bg-tek-dim text-tek-light',
  Event: 'bg-surface-raised text-bone-dim',
}

export default function VariantBadge({ variant }: { variant: CreatureVariant | string }) {
  return <span className={`badge ${STYLES[variant] ?? 'bg-surface-raised text-bone-dim'}`}>{variant}</span>
}
