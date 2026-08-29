import { defineStore } from 'pinia'
import { fetchRegions, fetchShard, rollWeightedChoices, type RegionInfo, type UnitRow } from '../game/units'
import { clearSave, loadSave, type RosterEntry, type SaveData } from '../game/storage'
import { RateUnit } from '../game/constants'
import { scoreEarned } from '../game/time'
import { message } from '../game/message'
import { formatDuration, formatScore } from '../game/format'

const TICK_MS = 100 // recalculate score 10x/second

// Captured once when the store is created, consumed once by init() to
// compute offline catch-up, then not needed again — kept outside reactive
// state so it isn't mistaken for something that needs to stay in sync.
let initialSave: SaveData | null = null

// Wall-clock cursor for the live tick loop. Also module-level rather than
// reactive state: nothing displays it, so there's no reason for a change to
// it to trigger a re-render or an autosave.
let lastTickAt = 0

export const useGameStore = defineStore('game', {
  state: () => {
    initialSave = loadSave()
    const saved = initialSave
    return {
      score: saved?.score ?? 0,
      goal: saved?.goal ?? 1000000,
      selectedGoal: saved?.selectedGoal ?? false,
      roster: saved?.roster ?? ({} as Record<number, RosterEntry>),
      rateUnit: saved?.rateUnit ?? RateUnit.YEAR,
      selectedRegionCode: saved?.selectedRegionCode ?? (null as string | null),
      selectedRegionName: saved?.selectedRegionName ?? (null as string | null),
      choices: saved?.choices ?? ([] as number[]),

      // Only show the intro to genuinely new players — anyone with a prior
      // save (even one from before this field existed) is treated as
      // already having seen it, so it doesn't interrupt an existing game.
      introSeen: saved?.introSeen ?? Boolean(saved),

      // When this save was first created. A brand new save gets "now". A
      // save that predates this field has no real record of when it
      // started — lastSaveTime is the closest approximation available
      // (at least a genuine past moment, rather than pretending it's new).
      saveStartedAt: saved?.saveStartedAt ?? saved?.lastSaveTime ?? Date.now(),

      // Set right before an intentional reset (clearSave + reload), so
      // main.ts's persist() can skip the write it would otherwise fire in
      // response — see resetGame() below.
      resetting: false,

      // Not persisted — re-fetched as needed. See init().
      regions: [] as RegionInfo[],
      regionsLoading: false,
      regionsError: null as string | null,

      shardUnits: [] as UnitRow[],
      shardLoading: false,
      shardError: null as string | null,
    }
  },

  getters: {
    totalRate: (state) =>
      Object.values(state.roster).reduce((sum, entry) => sum + entry.rate * entry.count, 0),

    // Name comes from the (already-loaded, since region is locked in)
    // shard rather than the roster entry itself — see the comment on
    // RosterEntry in storage.ts for why.
    rosterEntries: (state) =>
      Object.entries(state.roster)
        .map(([idStr, entry]) => {
          const id = Number(idStr)
          const unit = state.shardUnits.find(u => u.id === id)
          return { id, name: unit?.name ?? `Unit #${id}`, rate: entry.rate, count: entry.count }
        })
        .sort((a, b) => b.rate - a.rate),

    // Looks the offered ids up in the currently loaded shard to get full
    // display info (name/rate/weight).
    choiceUnits: (state) =>
      state.choices
        .map(id => state.shardUnits.find(u => u.id === id))
        .filter((u): u is UnitRow => !!u),

    getRateUnit: (state) => state.rateUnit,

  },

  actions: {
    // Called once, on app startup.
    async init() {
      if (this.selectedRegionCode) {
        // Returning player: the shard itself isn't saved to localStorage
        // (cheap to re-fetch, and the browser's HTTP cache means it's
        // usually instant on a repeat visit), so load it again here.
        await this.loadShardForRegion(this.selectedRegionCode)
        if (this.choices.length === 0) this.rerollChoices()
      } else {
        await this.loadRegionsList()
      }

      // Catch up on whatever production happened while the tab was closed
      // — same formula the live tick loop uses below, just with a
      // (potentially large) elapsedSeconds computed in one shot instead of
      // accumulated in small steps.
      if (initialSave) {
        const elapsedSeconds = Math.max(0, (Date.now() - initialSave.lastSaveTime) / 1000)
        if (elapsedSeconds > 0) {
          const earned = scoreEarned(this.totalRate, elapsedSeconds)
          this.score += earned
          // Only worth telling the player about if it's not just "the
          // normal gap between two ticks" — avoids a "welcome back!" banner
          // on every ordinary page refresh.
          if (elapsedSeconds >= 5 && earned > 0) {
            message.create(`Welcome back! You were away ${formatDuration(elapsedSeconds)} and earned $${formatScore(earned)}`,
              { closable: true, duration: 10000}
            )
          }
        }
      }

      lastTickAt = Date.now()
      setInterval(() => this.tick(), TICK_MS)
    },

    // Internal — driven by the interval above, not meant to be called
    // directly.
    tick() {
      const now = Date.now()
      const elapsedSeconds = (now - lastTickAt) / 1000
      lastTickAt = now
      this.score += scoreEarned(this.totalRate, elapsedSeconds)
    },

    dismissIntro() {
      this.introSeen = true
    },

    // Wipes the save and reloads, rather than resetting fields in place —
    // that way `state()`'s defaults stay the single source of truth for
    // "what a fresh save looks like" instead of duplicating it here.
    resetGame() {
      this.resetting = true
      clearSave()
      location.reload()
    },

    async loadRegionsList() {
      this.regionsLoading = true
      this.regionsError = null
      try {
        this.regions = await fetchRegions()
      } catch (err) {
        this.regionsError = err instanceof Error ? err.message : String(err)
      } finally {
        this.regionsLoading = false
      }
    },

    async loadShardForRegion(code: string) {
      this.shardLoading = true
      this.shardError = null
      try {
        this.shardUnits = await fetchShard(`units-${code.toLowerCase()}.json`)
      } catch (err) {
        this.shardError = err instanceof Error ? err.message : String(err)
      } finally {
        this.shardLoading = false
      }
    },

    async selectRegion(code: string, name: string) {
      this.selectedRegionCode = code
      this.selectedRegionName = name
      await this.loadShardForRegion(code)
      this.rerollChoices()
    },

    rerollChoices() {
      this.choices = rollWeightedChoices(this.shardUnits, 3)
    },

    pickUnit(id: number) {
      const unit = this.shardUnits.find(u => u.id === id)
      if (!unit) return

      const existing = this.roster[id]
      this.roster[id] = existing
        ? { ...existing, count: existing.count + 1 }
        : { rate: unit.rate, count: 1 }

      this.rerollChoices()
    },

    changeRateUnit() {
      const units = Object.values(RateUnit)
      const currentIndex = units.indexOf(this.rateUnit)
      this.rateUnit = units[(currentIndex + 1) % units.length]
    },

    setGoal(goal: number) {
      this.goal = goal
    }
  },
})
