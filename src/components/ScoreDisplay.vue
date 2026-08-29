<script setup lang="ts">
  import { computed } from 'vue'
  import { formatScore, getRateUnitFactor } from '../game/format'
  import { useGameStore } from '../stores/game'
  import { NProgress, useThemeVars } from 'naive-ui'

  const game = useGameStore()
  const scoreText = computed(() => formatScore(game.score))
  const goalText = computed(() => formatScore(game.goal))
  const rateText = computed(() => formatScore(game.totalRate, game.getRateUnit))
  const remainText = computed(() => {
    const diff = game.goal - game.score
    const remainTime = diff / game.totalRate
    const rateUnitFactor = 1 / getRateUnitFactor(game.getRateUnit)
    return formatScore(remainTime * rateUnitFactor)
  })
  const themeVars = useThemeVars()
</script>

<template>
  <div class="score-panel">
    <div class="score-value">${{ scoreText }}/{{goalText}}</div>
    <n-progress
      type="line"
      :percentage="(game.score / game.goal) * 100"
      :color="game.score / game.goal < 1 ? themeVars.infoColor : themeVars.successColor"
      :show-indicator=false
      processing
    />
    <div class="score-rate">${{ rateText }} /
      <button type="button" class="rate-unit-button" @click="game.changeRateUnit()">{{game.getRateUnit}}</button>
    </div>
    <p v-if="game.score && game.score < game.goal">You'll reach your goal in {{ remainText }} {{ game.getRateUnit.toLowerCase() }}s</p>
    <p v-else-if="game.score">You reached your goal!</p>
    <p v-else>Start building out your roster to track progress</p>
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
  padding-bottom: 5px;
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
