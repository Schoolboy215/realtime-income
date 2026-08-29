<script setup lang="ts">
  import { useGameStore } from '../stores/game';
  import { NCard } from 'naive-ui';

  const game = useGameStore()
</script>

<template>
  <div class="picker">
    <h2 align-text="true">Choose your region</h2>
    <p class="hint">This is locked in for this save once you pick.</p>

    <p v-if="game.regionsLoading" class="status">Loading regions…</p>
    <p v-else-if="game.regionsError" class="status error">{{ game.regionsError }}</p>

    <ul v-else class="region-list">
      <li v-for="r in game.regions" :key="r.code">
        <n-card type="button" size="medium" hoverable @click="game.selectRegion(r.code, r.region)">
          {{ r.region }}
        </n-card>
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
  }
  .hint {
    text-align: center;
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
</style>
