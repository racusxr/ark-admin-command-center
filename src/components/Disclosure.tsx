import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

/** Booleano recordado en localStorage (p. ej. si el panel de colores esta abierto). */
export function usePersistentToggle(key: string, initial: boolean): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : raw === '1'
    } catch {
      return initial
    }
  })
  function toggle() {
    setValue((prev) => {
      const next = !prev
      try {
        localStorage.setItem(key, next ? '1' : '0')
      } catch {
        /* sin almacenamiento: solo se pierde la preferencia */
      }
      return next
    })
  }
  return [value, toggle]
}

interface DisclosureProps {
  title: string
  /** Resumen en una linea, visible solo mientras la seccion esta cerrada. */
  summary?: ReactNode
  open: boolean
  onToggle: () => void
  children: ReactNode
}

/**
 * Seccion plegable minimalista. El contenido queda montado aunque este
 * oculto, asi no se pierde el estado interno (p. ej. las regiones elegidas
 * en el selector de colores) al cerrar y volver a abrir.
 */
export default function Disclosure({ title, summary, open, onToggle, children }: DisclosureProps) {
  return (
    <section className="border-t border-surface-line/60 py-4">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full min-h-11 sm:min-h-0 flex items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-3 min-w-0">
          <span className="font-display font-semibold text-bone">{title}</span>
          {!open && summary && (
            <span className="flex items-center gap-2 text-xs text-bone-faint min-w-0 truncate">
              {summary}
            </span>
          )}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-bone-faint transition-transform motion-reduce:transition-none ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div hidden={!open} className="pt-4">
        {children}
      </div>
    </section>
  )
}
