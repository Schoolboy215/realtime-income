<script setup lang="ts">
  import { onMounted } from 'vue'
  import IntroScreen from './components/IntroScreen.vue'
  import ScoreDisplay from './components/ScoreDisplay.vue'
  import ChoicesPanel from './components/ChoicesPanel.vue'
  import RosterPanel from './components/RosterPanel.vue'
  import RegionPicker from './components/RegionPicker.vue'
  import GoalPicker from './components/GoalPicker.vue'
  import StatsPanel from './components/StatsPanel.vue'
  import { useGameStore } from './stores/game'
  import { NButton, NPopover, NConfigProvider, type GlobalThemeOverrides } from 'naive-ui'

  const game = useGameStore()

  // Only the values naive-ui components actually need to match style.css —
  // that file stays the source of truth (and keeps free light/dark
  // switching via prefers-color-scheme); these are just mirrored copies
  // for naive-ui's own internals, which don't read CSS custom properties.
  const themeOverrides: GlobalThemeOverrides = {
    common: {
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif',
      primaryColor: '#4ade80', // matches --accent in style.css
      successColor: '#66CE54'
    },
  }

  onMounted(() => {
    game.init()
  })
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
  <main>
    <h1 v-if="game.introSeen">Realtime income</h1>
    <IntroScreen v-if="!game.introSeen" />
    <RegionPicker v-else-if="!game.selectedRegionCode" />
    <GoalPicker v-else-if="game.selectedRegionCode && !game.selectedGoal"/>
    <template v-else>
      <p v-if="game.shardLoading" class="status">Loading {{ game.selectedRegionName }}…</p>
      <p v-else-if="game.shardError" class="status error">{{ game.shardError }}</p>
      <template v-else>
        <ScoreDisplay />
        <ChoicesPanel />
        <StatsPanel />
        <RosterPanel />
      </template>
    </template>

    <n-popover trigger="hover" v-if="game.introSeen">
      <template #trigger>
        <n-button class="reset-button" @click="game.resetGame()">Reset save</n-button>
      </template>
      <span>This will clear your local storage and bring you to the region/goal selection stage with no roster and 0 score</span>
    </n-popover>
  </main>
  </n-config-provider>
</template>

<style scoped>
  main {
    max-width: 720px;
    margin: 0 auto;
    padding-bottom: 3rem;
    position: relative;
    font-family: Inter;
  }
  .reset-button {
    display: block;
    margin: 2rem auto 0;
    padding: 0.3rem 0.6rem;
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
