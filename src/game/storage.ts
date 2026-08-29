// Persistence to the browser's localStorage — one save per browser (per user).
const STORAGE_KEY = 'income-pooler-save'

import { RateUnit } from "./constants"

// `name` is deliberately NOT stored here — it's looked up live from the
// loaded region shard instead (see the rosterEntries getter), so a display
// cleanup (e.g. the OCC_TITLE singularization pass) applies to old picks
// too, not just ones made after the cleanup existed. Safe to do only
// because region is locked in at game start, so the roster's units are
// always a subset of the one shard that's already loaded.
//
// `rate` IS still snapshotted — unlike the name, it directly determines
// score, so a past pick's earning power shouldn't silently change if the
// underlying wage data is ever revised.
export interface RosterEntry {
  rate: number
  count: number
}

export interface SaveData {
  version: 4
  score: number
  goal: number
  selectedGoal: boolean
  rateUnit: RateUnit
  roster: Record<number, RosterEntry> // unitId -> rate snapshot + count owned
  selectedRegionCode: string | null
  selectedRegionName: string | null
  choices: number[] // current 3 offered unit ids
  lastSaveTime: number // epoch ms — used to catch up production on reload
  introSeen?: boolean // absent on saves from before this field existed
  saveStartedAt?: number // epoch ms when this save was first created; absent on older saves
}

export function loadSave(): SaveData | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && parsed.version === 4) return parsed as SaveData
  } catch {
    // corrupt/old-shape save, ignore and start fresh
  }
  return null
}

export function writeSave(data: SaveData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearSave(): void {
  localStorage.removeItem(STORAGE_KEY)
}
