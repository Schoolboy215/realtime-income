// Build-time only: converts data/units.csv into per-region JSON shards under
// public/data/, so the app only ever fetches the region(s) a player actually
// needs instead of the entire dataset. Runs in Node, never in the browser.
import { parse } from 'csv-parse/sync'
import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const csvPath = path.join(rootDir, 'data', 'units.csv')
const outDir = path.join(rootDir, 'public', 'data')

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function main() {
  const csvText = readFileSync(csvPath, 'utf-8')
  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    cast: (value, context) => {
      if (context.column === 'ID' || context.column === 'TOT_EMP') return parseInt(value, 10)
      if (context.column === 'A_MEAN') return parseFloat(value)
      return value
    },
  })

  // public/data/ is fully generated — wipe it so stale shards from a
  // previous run (e.g. a renamed/removed region) never linger.
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(outDir, { recursive: true })

  // Grouped by the stable state code (PRIM_STATE) rather than the full name
  // (AREA_TITLE) — shorter, URL-safe filenames. AREA_TITLE is carried along
  // per-group purely for display in the manifest.
  const byRegion = new Map()
  for (const row of rows) {
    if (!byRegion.has(row.PRIM_STATE)) byRegion.set(row.PRIM_STATE, [])
    byRegion.get(row.PRIM_STATE).push(row)
  }

  const manifest = []
  for (const [code, regionRows] of byRegion) {
    const slug = slugify(code)
    const file = `units-${slug}.json`

    // Columnar shape: field name -> array of values, instead of an array of
    // {id, name, ...} objects. Same data, no repeated key names per row.
    const shard = {
      id: regionRows.map(r => r.ID),
      name: regionRows.map(r => r.OCC_TITLE),
      weight: regionRows.map(r => r.TOT_EMP),
      rate: regionRows.map(r => r.A_MEAN),
    }

    writeFileSync(path.join(outDir, file), JSON.stringify(shard))
    manifest.push({ region: regionRows[0].AREA_TITLE, code, slug, file, count: regionRows.length })
  }

  writeFileSync(path.join(outDir, 'regions.json'), JSON.stringify(manifest))

  console.log(`Built ${manifest.length} region shard(s) from ${rows.length} row(s):`)
  for (const m of manifest) console.log(`  ${m.region.padEnd(22)} (${m.code}) ${String(m.count).padStart(6)} rows -> ${m.file}`)
}

main()
