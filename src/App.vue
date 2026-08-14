<script setup lang="ts">
  import ScoreDisplay from './components/ScoreDisplay.vue'
  import ChoicesPanel from './components/ChoicesPanel.vue'
  import RosterPanel from './components/RosterPanel.vue'
</script>

<template>
  <main>
    <h1>Income Pooler</h1>
    <ScoreDisplay />
    <ChoicesPanel />
    <RosterPanel />
  </main>
</template>

<style scoped>
  main {
    max-width: 720px;
    margin: 0 auto;
    padding-bottom: 3rem;
  }
  h1 {
    text-align: center;
    padding-top: 1.5rem;
    font-size: 1.4rem;
    letter-spacing: 0.02em;
    color: var(--muted);
  }
</style>
