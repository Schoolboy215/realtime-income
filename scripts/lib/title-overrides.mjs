import { parse } from 'csv-parse/sync'
import { readFileSync, existsSync } from 'node:fs'

/** Loads data/title-overrides.csv into a Map of original -> singular. */
export function loadTitleOverrides(overridesPath) {
  if (!existsSync(overridesPath)) return new Map()
  const text = readFileSync(overridesPath, 'utf-8')
  const rows = parse(text, { columns: true, skip_empty_lines: true })
  return new Map(rows.map(r => [r.original, r.singular]))
}
