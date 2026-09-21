import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dictionaries, type Lang, type TKey } from './translations'
import { getLang, setLang as storeLang } from '../utils/storage'

export type TVars = Record<string, string | number>
export type TFn = (key: TKey, vars?: TVars) => string

interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Traducción tipada: solo acepta claves que existen en el diccionario. */
  t: TFn
  /** Traducción dinámica con respaldo: para etiquetas derivadas de datos (filtros, categorías...). */
  tx: (key: string, fallback: string) => string
}

function format(template: string, vars?: TVars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  )
}

/** Idioma inicial: el guardado por el usuario; si no hay, el del navegador (EN si es inglés, ES en otro caso). */
function detectInitialLang(): Lang {
  const saved = getLang()
  if (saved) return saved
  const browser = typeof navigator !== 'undefined' ? navigator.language?.toLowerCase() : ''
  return browser.startsWith('en') ? 'en' : 'es'
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang)

  const setLang = useCallback((next: Lang) => {
    storeLang(next)
    setLangState(next)
  }, [])

  const t = useCallback<TFn>((key, vars) => format(dictionaries[lang][key], vars), [lang])

  const tx = useCallback(
    (key: string, fallback: string) => dictionaries[lang][key as TKey] ?? fallback,
    [lang],
  )

  // Mantiene <html lang> y la meta description sincronizados con el idioma.
  useEffect(() => {
    document.documentElement.lang = lang
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', dictionaries[lang]['meta.description'])
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t, tx }), [lang, setLang, t, tx])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n debe usarse dentro de <I18nProvider>')
  return ctx
}
