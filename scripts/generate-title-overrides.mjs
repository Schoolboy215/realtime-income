// One-off (well — re-runnable) helper: proposes a singular form for every
// distinct OCC_TITLE in data/units.csv, using the `pluralize` library, and
// writes them to data/title-overrides.csv for hand review.
//
// Safe to re-run: existing rows (anything already reviewed) are preserved
// exactly as-is. Only titles not already present get a freshly generated
// proposal appended. This is a review file, not a generated build artifact
// like public/data/ — it's meant to be committed once reviewed.
import { parse } from 'csv-parse/sync'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pluralize from 'pluralize'
import { loadTitleOverrides } from './lib/title-overrides.mjs'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const csvPath = path.join(rootDir, 'data', 'units.csv')
const overridesPath = path.join(rootDir, 'data', 'title-overrides.csv')

// Singularizes each word independently (preserving whitespace/punctuation),
// so multi-noun titles like "Farmers, Ranchers, and Other Agricultural
// Managers" get every plural noun handled, not just the last word.
function singularizeTitle(title) {
  return title
    .split(/(\s+)/) // capture group keeps whitespace runs as their own tokens
    .map(token => {
      if (/^\s+$/.test(token)) return token
      const match = token.match(/^([A-Za-z'-]+)(.*)$/) // word core vs trailing punctuation
      if (!match) return token
      const [, word, trailing] = match
      if (/'s$/i.test(word)) return token // possessive (e.g. "Sheriff's") — not a plural, leave it
      return pluralize.singular(word) + trailing
    })
    .join('')
}

function main() {
  const csvText = readFileSync(csvPath, 'utf-8')
  const rows = parse(csvText, { columns: true, skip_empty_lines: true })

  const distinctTitles = [...new Set(rows.map(r => r.OCC_TITLE))].sort()
  const existing = loadTitleOverrides(overridesPath)

  const out = ['original,singular,changed']
  let added = 0
  for (const title of distinctTitles) {
    const singular = existing.has(title) ? existing.get(title) : singularizeTitle(title)
    if (!existing.has(title)) added++
    const changed = singular !== title
    out.push([csvField(title), csvField(singular), changed].join(','))
  }

  writeFileSync(overridesPath, out.join('\n') + '\n')
  console.log(`${distinctTitles.length} distinct titles total, ${added} newly proposed.`)
  console.log(`Wrote ${overridesPath}`)
}

function csvField(value) {
  // Quote any field that needs it (these titles routinely contain commas).
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

main()
