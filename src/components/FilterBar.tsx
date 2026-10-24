interface FilterBarProps {
  options: string[]
  active: string
  onChange: (value: string) => void
  /** Etiqueta visible de cada opción (por defecto, el propio valor). */
  renderLabel?: (option: string) => string
}

export default function FilterBar({ options, active, onChange, renderLabel }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-full text-xs font-display font-semibold tracking-wide border transition-colors ${
            active === opt
              ? 'bg-rust text-ink border-rust'
              : 'bg-surface text-bone-dim border-surface-line hover:border-rust/60 hover:text-bone'
          }`}
        >
          {renderLabel ? renderLabel(opt) : opt}
        </button>
      ))}
    </div>
  )
}
