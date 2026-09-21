import type { HistoryEntry } from '../types'
import type { Lang } from '../i18n/translations'

const FAVORITES_KEY = 'ark-cc:favorites'
const HISTORY_KEY = 'ark-cc:history'
const MAX_HISTORY = 50

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function getFavorites(): HistoryEntry[] {
  return safeParse<HistoryEntry[]>(localStorage.getItem(FAVORITES_KEY), [])
}

export function isFavorite(command: string, favorites: HistoryEntry[]): boolean {
  return favorites.some((f) => f.command === command)
}

export function toggleFavorite(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): HistoryEntry[] {
  const current = getFavorites()
  const existingIndex = current.findIndex((f) => f.command === entry.command)

  let next: HistoryEntry[]
  if (existingIndex >= 0) {
    next = current.filter((_, i) => i !== existingIndex)
  } else {
    next = [
      { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
      ...current,
    ]
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
  return next
}

export function removeFavorite(id: string): HistoryEntry[] {
  const next = getFavorites().filter((f) => f.id !== id)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
  return next
}

export function getHistory(): HistoryEntry[] {
  return safeParse<HistoryEntry[]>(localStorage.getItem(HISTORY_KEY), [])
}

export function pushHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): HistoryEntry[] {
  const current = getHistory()
  const next = [
    { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
    ...current,
  ].slice(0, MAX_HISTORY)

  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  return next
}

export function removeHistoryEntry(id: string): HistoryEntry[] {
  const next = getHistory().filter((h) => h.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  return next
}

export function clearHistory(): HistoryEntry[] {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]))
  return []
}

/* --- Preferencias de la app ------------------------------------------------ */

const PREFIX_KEY = 'ark-cc:prefix'

export function getCheatPrefix(): 'cheat' | 'admincheat' {
  const raw = localStorage.getItem(PREFIX_KEY)
  return raw === 'cheat' ? 'cheat' : 'admincheat'
}

export function setCheatPrefix(prefix: 'cheat' | 'admincheat'): 'cheat' | 'admincheat' {
  localStorage.setItem(PREFIX_KEY, prefix)
  return prefix
}

const LANG_KEY = 'ark-cc:lang'

/** Idioma guardado por el usuario, o null si nunca eligió uno. */
export function getLang(): Lang | null {
  try {
    const raw = localStorage.getItem(LANG_KEY)
    return raw === 'es' || raw === 'en' ? raw : null
  } catch {
    return null
  }
}

export function setLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    /* localStorage no disponible (modo privado, etc.): el idioma solo dura la sesión. */
  }
}
