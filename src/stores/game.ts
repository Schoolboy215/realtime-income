import { defineStore } from 'pinia'
import { UNIT_BY_ID, rollChoices } from '../game/units'
import { loadSave } from '../game/storage'

export const useGameStore = defineStore('game', {
  state: () => {
    const saved = loadSave()
    return {
      score: saved?.score ?? 0,
      roster: saved?.roster ?? ({} as Record<string, number>), // unitId -> count owned
      choices: saved?.choices?.length ? saved.choices : rollChoices(3), // 3 offered unit ids
    }
  },

  getters: {
    totalRate: (state) =>
      Object.entries(state.roster).reduce((sum, [id, count]) => {
        const unit = UNIT_BY_ID[id]
        return sum + (unit ? unit.rate * count : 0)
      }, 0),

    choiceUnits: (state) => state.choices.map(id => UNIT_BY_ID[id]).filter(Boolean),

    rosterEntries: (state) =>
      Object.entries(state.roster)
        .map(([id, count]) => ({ unit: UNIT_BY_ID[id], count }))
        .filter(e => e.unit)
        .sort((a, b) => b.unit.rate - a.unit.rate),
  },

  actions: {
    pickUnit(id: string) {
      this.roster[id] = (this.roster[id] ?? 0) + 1
      this.choices = rollChoices(3)
    },
  },
})
