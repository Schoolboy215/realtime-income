<script setup lang="ts">
import { formatScore } from '../game/format'
import { useGameStore } from '../stores/game'

const game = useGameStore()
</script>

<template>
  <div class="choices">
    <button
      v-for="unit in game.choiceUnits"
      :key="unit.id"
      class="choice-card"
      type="button"
      @click="game.pickUnit(unit.id)"
    >
      <span class="icon">{{ unit.icon }}</span>
      <span class="name">{{ unit.name }}</span>
      <span class="rate">+{{ formatScore(unit.rate) }} / yr</span>
    </button>
  </div>
</template>

<style scoped>
.choices {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  padding: 0 1rem;
}
.choice-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 1rem 0.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: inherit;
  cursor: pointer;
  transition: transform 0.08s ease, background 0.15s ease, border-color 0.15s ease;
}
.choice-card:hover {
  border-color: var(--accent);
  background: var(--surface-hover);
}
.choice-card:active {
  transform: scale(0.97);
}
.icon {
  font-size: 1.8rem;
}
.name {
  font-weight: 600;
  text-align: center;
}
.rate {
  color: var(--accent);
  font-variant-numeric: tabular-nums;
  font-size: 0.9rem;
}

@media (max-width: 560px) {
  .choices {
    grid-template-columns: 1fr;
  }
}
</style>
