import { useMemo } from 'react'
import commandsData from '../data/commands.json'
import commandsEn from '../data/commands.en.json'
import type { CommandDef } from '../types'
import type { Lang } from './translations'
import { useI18n } from './I18nContext'

/**
 * `commands.json` es la fuente (en español). `commands.en.json` solo contiene
 * los textos traducibles por id: `description` y `params.<nombre>`.
 * Syntax, ejemplo, nombres de parámetros y tipos son código y no se traducen.
 */
interface CommandTranslation {
  description: string
  params?: Record<string, string>
}

const baseCommands = commandsData as CommandDef[]
const translations = commandsEn as Record<string, CommandTranslation>

export function localizeCommands(lang: Lang): CommandDef[] {
  if (lang === 'es') return baseCommands
  return baseCommands.map((c) => {
    const tr = translations[c.id]
    if (!tr) return c
    return {
      ...c,
      description: tr.description,
      params: c.params.map((p) => ({ ...p, description: tr.params?.[p.name] ?? p.description })),
    }
  })
}

/** Lista de comandos con descripciones en el idioma activo. */
export function useCommands(): CommandDef[] {
  const { lang } = useI18n()
  return useMemo(() => localizeCommands(lang), [lang])
}
