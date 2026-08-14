// Persistence to the browser's localStorage — one save per browser (per user).
const STORAGE_KEY = 'income-pooler-save'

export interface SaveData {
  version: 1
  score: number
  roster: Record<string, number> // unitId -> count owned
  choices: string[] // current 3 offered unit ids
}

export function loadSave(): SaveData | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && parsed.version === 1) return parsed as SaveData
  } catch {
    // corrupt/old save, ignore and start fresh
  }
  return null
}

export function writeSave(data: SaveData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
