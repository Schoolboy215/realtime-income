<script setup lang="ts">
  import { onMounted } from 'vue'
  import ScoreDisplay from './components/ScoreDisplay.vue'
  import ChoicesPanel from './components/ChoicesPanel.vue'
  import RosterPanel from './components/RosterPanel.vue'
  import RegionPicker from './components/RegionPicker.vue'
  import GoalPicker from './components/GoalPicker.vue'
  import WelcomeBackBanner from './components/WelcomeBackBanner.vue'
  import { useGameStore } from './stores/game'

  const game = useGameStore()

  onMounted(() => {
    game.init()
  })
</script>

<template>
  <WelcomeBackBanner />
  <main>
    <h1>Income Pooler</h1>

    <RegionPicker v-if="!game.selectedRegionCode" />
    <GoalPicker v-else-if="game.selectedRegionCode && !game.selectedGoal"/>
    <template v-else>
      <p v-if="game.shardLoading" class="status">Loading {{ game.selectedRegionName }}…</p>
      <p v-else-if="game.shardError" class="status error">{{ game.shardError }}</p>
      <template v-else>
        <ScoreDisplay />
        <ChoicesPanel />
        <RosterPanel />
      </template>
    </template>

    <button type="button" class="reset-button" @click="game.resetGame()">Reset save</button>
  </main>
</template>

<style scoped>
  main {
    max-width: 720px;
    margin: 0 auto;
    padding-bottom: 3rem;
    position: relative;
  }
  .reset-button {
    display: block;
    margin: 2rem auto 0;
    padding: 0.3rem 0.6rem;
    border: none;
    background: none;
    color: var(--muted);
    font-size: 0.75rem;
    cursor: pointer;
    opacity: 0.6;
  }
  .reset-button:hover {
    opacity: 1;
    text-decoration: underline;
  }
  h1 {
    text-align: center;
    padding-top: 1.5rem;
    font-size: 1.4rem;
    letter-spacing: 0.02em;
    color: var(--muted);
  }
  .status {
    text-align: center;
    color: var(--muted);
    padding: 2rem 1rem;
  }
  .status.error {
    color: #ef4444;
  }
</style>
