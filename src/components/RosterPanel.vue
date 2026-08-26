<script setup lang="ts">
  import { formatScore } from '../game/format'
  import { useGameStore } from '../stores/game'
  import { computed } from 'vue'

  const game = useGameStore()
  const rosterCount = computed(() => {
    let ret = 0
    for (let i = 0; i < game.rosterEntries.length; i++) {
      ret += game?.rosterEntries?.at(i)?.count ?? 0;
    }
    return ret
  })
</script>

<template>
  <div class="roster">
    <h2>Your Roster ({{rosterCount}})</h2>
    <p v-if="game.rosterEntries.length === 0" class="empty">
      Pick your first unit above to start earning.
    </p>
    <ul v-else class="roster-list">
      <li v-for="entry in game.rosterEntries" :key="entry.id" class="roster-item">
        <span class="name">{{ entry.name }}</span>
        <span class="count" v-if="entry.count > 1">×{{ entry.count }}</span>
        <span class="rate">{{ formatScore(entry.rate * entry.count) }} / yr</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.roster {
  padding: 1rem;
  max-width: 640px;
  margin: 0 auto;
  width: 100%;
}
h2 {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  margin-bottom: 0.75rem;
}
.empty {
  color: var(--muted);
}
.roster-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.roster-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
}
.name {
  flex: 1;
}
.count {
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.rate {
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
</style>
