# Realtime Income

An idle "game" built on real US wage data: pick a region, then draw
occupations and stack their combined annual earnings toward a goal.

It's easy to look at a number like $1M/year and know that it means one million dollars in one year.
But this will let you see that million dollars arrive in real time. Progress is saved when the tab isn't open and you can check back in any time to catch up.

Everything saved is local to your browser.

---

## Tech stack

- **Vue 3** (`<script setup>`, Composition API) + **TypeScript**
- **Vite 8** for the dev server and build
- **Pinia** for state (`src/stores/game.ts`)
- **naive-ui** + `@vicons/carbon` for UI components and icons
- No router, no backend, no runtime env vars. The built output is a fully
  static bundle that talks only to its own JSON files under `data/`.

## Prerequisites

- **Node 22+** (Vite 8 needs Node 20.19+/22.12+; CI uses 22)
- **npm** (a `package-lock.json` is committed)
- **Python 3** — only if you want to regenerate the dataset from the raw BLS
  spreadsheet. Not needed to run or build the app.

## Quick start

```sh
npm install
npm run dev      # http://localhost:5173
```

The `predev` and `prebuild` hooks run `scripts/build-units.mjs` automatically,
which generates `public/data/` from `data/units.csv` before the server or build
starts. That directory is git-ignored — it's a build artifact.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server (regenerates `public/data/` first) |
| `npm run build` | `vue-tsc` typecheck, then `vite build` → `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `node scripts/build-units.mjs` | Rebuild the per-region JSON shards from `data/units.csv` |
| `node scripts/generate-title-overrides.mjs` | Propose singular forms for any new occupation titles (see [Data pipeline](#data-pipeline)) |

## Project structure

```
data/                     Source data (see Data pipeline below)
scripts/build-units.mjs   data/units.csv  ->  public/data/*.json shards
public/data/              Generated shards + regions.json manifest (git-ignored)
src/
  main.ts                 App bootstrap + the localStorage save loop
  stores/game.ts          All game state and the tick loop (Pinia)
  game/                   Pure logic: units, scoring, formatting, time, storage
  components/             UI panels (region picker, roster, choices, stats, ...)
```

## Data pipeline

Numbers come from the US Bureau of Labor Statistics **Occupational Employment
and Wage Statistics (OEWS)**, May 2025 release
(<https://www.bls.gov/oes/special-requests/oesm25all.zip>).

The chain, source of truth first:

1. `data/oesm25all/all_data_M_2025.xlsx` — the raw BLS workbook, committed as-is.
2. `data/oesm25all/trimmed.csv` — the state-level rows and the six columns the
   game uses (`AREA_TITLE`, `PRIM_STATE`, `OCC_TITLE`, `TOT_EMP`, `A_MEAN`),
   exported from the workbook by hand.
3. `data/oesm25all/add_ids.py` — stamps a sequential `ID` on each row.
4. `data/units.csv` — the app's actual input: one row per (state, occupation)
   with a stable ID. Committed.
5. `data/title-overrides.csv` — hand-reviewed singular forms for occupation
   titles ("Accountants and Auditors" → "Accountant/Auditor"). `OCC_TITLE` in
   the BLS data is always plural; the game shows one unit at a time.
   `generate-title-overrides.mjs` proposes rows for any title not yet in the
   file using the `pluralize` library; you review and commit them. A missing
   entry warns during the build and falls back to the plural.
6. `scripts/build-units.mjs` — groups `units.csv` by state and writes one
   compact `public/data/units-<code>.json` per region plus a `regions.json`
   manifest. The app fetches only the shard for the region the player picked.

To refresh with a newer BLS release: replace the workbook, redo steps 2–4, run
`generate-title-overrides.mjs` and review its additions, then `npm run build`.

## Where player state lives

One save per browser, in `localStorage` under the key `realtime-income-save`
(`src/game/storage.ts`). The current schema is `version: 4`; loads of any other
shape are discarded and the game starts fresh. Nothing is sent anywhere.

**Known caveat:** a second tab left open on the game can overwrite the save made
by another tab — last write wins, no merge. Left as-is deliberately.

## Self-hosting

The build is static — `npm run build`, then serve `dist/` from any static host
or CDN. No server, database, or SPA rewrite rules needed (there's no
client-side router).

### The base-path gotcha

`vite.config.ts` sets Vite's `base` to `/` — correct for serving from the root
of a domain. If you serve from a subpath instead, `base` has to match it:

- **Domain root** (`https://example.com/`) — the default `/` is correct;
  nothing to change.
- **A subpath** (`https://example.com/games/income/`) — set
  `base: '/games/income/'`.
- **A GitHub Pages project site with no custom domain**
  (`https://<user>.github.io/<repo>/`) — set `base: '/<repo>/'`.

The runtime `fetch()` calls in `src/game/units.ts` build their URLs from
`import.meta.env.BASE_URL`, so they follow `base` automatically — but only if
`base` is set correctly for where you deploy.

### GitHub Pages

`.github/workflows/deploy.yml` builds and deploys on every push to `master`.
`public/CNAME` pins the custom domain so the deploy doesn't clear it. To use
this for your own deploy:

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Either set your own domain in `public/CNAME` (and point a DNS `CNAME` record
   at `<user>.github.io`), or delete `public/CNAME` and set
   `base: '/<repo>/'` in `vite.config.ts` to serve from the github.io subpath.
3. Push. The workflow's deploy job prints the live URL.

### Netlify / Vercel / nginx / Caddy / etc.

Build command `npm run build`, publish directory `dist`. Leave `base` at `/`
unless you're serving from a subpath. No redirect or rewrite config required.
