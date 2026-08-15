<script setup lang="ts">
import { useGameStore } from '../stores/game'

const game = useGameStore()
</script>

<template>
  <div class="picker">
    <h2>Choose your region</h2>
    <p class="hint">This is locked in for this save once you pick.</p>

    <p v-if="game.regionsLoading" class="status">Loading regions…</p>
    <p v-else-if="game.regionsError" class="status error">{{ game.regionsError }}</p>

    <ul v-else class="region-list">
      <li v-for="r in game.regions" :key="r.code">
        <button type="button" @click="game.selectRegion(r.code, r.region)">
          {{ r.region }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.picker {
  padding: 1.5rem 1rem;
  max-width: 640px;
  margin: 0 auto;
}
h2 {
  text-align: center;
  font-size: 1.2rem;
}
.hint {
  text-align: center;
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
}
.status {
  text-align: center;
  color: var(--muted);
}
.status.error {
  color: #ef4444;
}
.region-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.5rem;
}
.region-list button {
  width: 100%;
  padding: 0.6rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: inherit;
  cursor: pointer;
}
.region-list button:hover {
  border-color: var(--accent);
  background: var(--surface-hover);
}
</style>
