// Persistence to the browser's localStorage — one save per browser (per user).
const STORAGE_KEY = 'income-pooler-save'

export interface RosterEntry {
  name: string
  rate: number
  count: number
}

export interface SaveData {
  version: 3
  score: number
  roster: Record<number, RosterEntry> // unitId -> snapshot + count owned
  selectedRegionCode: string | null
  selectedRegionName: string | null
  choices: number[] // current 3 offered unit ids
  lastSaveTime: number // epoch ms — used to catch up production on reload
}

export function loadSave(): SaveData | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && parsed.version === 3) return parsed as SaveData
  } catch {
    // corrupt/old-shape save, ignore and start fresh
  }
  return null
}

export function writeSave(data: SaveData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
