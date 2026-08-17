<script setup lang="ts">
  import { computed } from 'vue'
  import { formatScore } from '../game/format'
  import { useGameStore } from '../stores/game'

  const game = useGameStore()
  const scoreText = computed(() => formatScore(game.score))
  const rateText = computed(() => formatScore(game.totalRate, game.getRateUnit))
</script>

<template>
  <div class="score-panel">
    <div class="score-value">${{ scoreText }}</div>
    <div class="score-rate">{{ rateText }} /
      <button type="button" class="rate-unit-button" @click="game.changeRateUnit()">{{game.getRateUnit}}</button>
    </div>
  </div>
</template>

<style scoped>
.score-panel {
  text-align: center;
  padding: 1.5rem 1rem;
}
.score-value {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.score-rate {
  margin-top: 0.4rem;
  color: var(--muted);
  font-size: 1.1rem;
  font-variant-numeric: tabular-nums;
}
.rate-unit-button {
  padding: 0.6rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: inherit;
  cursor: pointer;
}
.rate-unit-button:hover {
  border-color: var(--accent);
  background: var(--surface-hover);
}

</style>
