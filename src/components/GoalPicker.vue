<script setup lang="ts">
import { useGameStore } from '../stores/game'

const game = useGameStore()
</script>

<template>
  <h2>Pick a goal</h2>
  <input v-model.number="game.goal" type="number" autocomplete="off">
  <button @click="game.selectedGoal = true">Save</button>
</template>

<style scoped>
</style>
