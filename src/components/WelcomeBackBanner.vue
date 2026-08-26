<script setup lang="ts">
import { computed } from 'vue'
import { formatDuration, formatScore } from '../game/format'
import { useGameStore } from '../stores/game'

const game = useGameStore()
const text = computed(() => {
  if (!game.welcomeBack) return ''
  return `Welcome back! You were away ${formatDuration(game.welcomeBack.seconds)} and earned ${formatScore(game.welcomeBack.earned)}.`
})
</script>

<template>
  <div v-if="game.welcomeBack" class="notice">
    <span>{{ text }}</span>
    <button type="button" @click="game.dismissWelcomeBack">✕</button>
  </div>
</template>

<style scoped>
.notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: var(--accent);
  color: var(--accent-contrast);
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
}
button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}
</style>
