<script setup lang="ts">
import { computed } from 'vue'
import { formatScore } from '../game/format'
import { useGameStore } from '../stores/game'

const game = useGameStore()
const scoreText = computed(() => formatScore(game.score))
const rateText = computed(() => formatScore(game.totalRate))
</script>

<template>
  <div class="score-panel">
    <div class="score-value">{{ scoreText }}</div>
    <div class="score-rate">{{ rateText }} / year</div>
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
</style>
