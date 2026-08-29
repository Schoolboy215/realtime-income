<script setup lang="ts">
  import { useGameStore } from '../stores/game'
  import { NButton } from 'naive-ui'

  const game = useGameStore()
</script>

<template>
  <div class="intro">
    <h2>Welcome to Income Pooler</h2>
    <p>
      This "game" is meant to help visualize how the incomes of averages workers stack up/combine
      to give you a sense of the time that it takes to reach a certain number. For example, how long would it take 100
      average workers to earn a million dollars. A billion? These are easy numbers to calculate, but this tool will
      let you check in on progress in real time, view statistics about how your roster compares to the real world average, and see
      how your results can vary between regions.
    </p>
    <p>
      After picking a state, you'll get choices based on real statistics about the number of jobs in that state. For example you'll see a lot
      of software developers in Washington compared to most places. A lot of service/hospitality workers in Hawaii. Many registered nurses in Florida.
    </p>
    <p>
      Every occupation you see comes from real U.S. Bureau of Labor Statistics wage data (May 2025 Occupational Employment and Wage Statistics).
      <br/>
      <a href="https://www.bls.gov/oes/special-requests/oesm25all.zip">[May 2025 - XLSX file]</a>
    </p>
    <p>
      Pick a region, start recruiting workers, and pool their income toward a goal you set.
    </p>
    <n-button type="info" size="large" @click="game.dismissIntro()">Get started</n-button>
  </div>
</template>

<style scoped>
.intro {
  padding: 1.5rem 1rem;
  max-width: 720px;
  margin: 0 auto;
}
h2 {
  margin-bottom: 1rem;
  text-align: center;
}
p {
  color: var(--muted);
  margin-bottom: 1rem;
}
</style>
