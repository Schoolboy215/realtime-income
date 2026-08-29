<script setup lang="ts">
  import { formatScore } from '../game/format'
  import { useGameStore } from '../stores/game'
  import { computed } from 'vue'
  import { NCollapse, NCollapseItem, NCard, NIcon } from 'naive-ui'
  import { Person } from '@vicons/carbon'

  const game = useGameStore()
  const rosterCount = computed(() => {
    let ret = 0
    for (let i = 0; i < game.rosterEntries.length; i++) {
      ret += game?.rosterEntries?.at(i)?.count ?? 0;
    }
    return ret
  })
  function randomDepth(seed: number) {
    let x = Math.sin(seed) * 10000
    x -= Math.floor(x)
    if (x <= 0.33)
      return 3
    else if (x <= 0.66)
      return 4
    else
      return 5
  }
</script>

<template>
    <n-collapse>
      <n-collapse-item>
        <template #header>
          <h2 class="stats-header">Your Roster ({{rosterCount}})</h2>
        </template>
        <n-collapse class="stats-collapse">
          <n-collapse-item>
            <template #header>
              <h3 class="stats-header">View roster list</h3>
            </template>
            <p v-if="game.rosterEntries.length === 0" class="empty">
              Pick your first unit above to start earning.
            </p>
            <ul v-else class="roster-list">
              <li v-for="entry in game.rosterEntries" :key="entry.id">
                <n-card
                  :content-style="{ display: 'flex', alignItems: 'center', gap: '0.6rem' }"
                >
                  <span class="name">{{ entry.name }}</span>
                  <span class="count" v-if="entry.count > 1">×{{ entry.count }}</span>
                  <span class="rate">{{ formatScore(entry.rate * entry.count) }} / yr</span>
                </n-card>
              </li>
            </ul>
          </n-collapse-item>
          <n-collapse-item>
            <template #header>
              <h3 class="stats-header">Visualize roster</h3>
            </template>
            <n-icon v-for="r in rosterCount" :key="r" size=48 :depth="randomDepth(r)">
              <Person/>
            </n-icon>
          </n-collapse-item>
        </n-collapse>
      </n-collapse-item>
    </n-collapse>
</template>

<style scoped>
.stats-header {
    margin: 0;
    color: var(--muted);
}
.stats-collapse :deep(.n-collapse-item__header-main) {
    justify-content: first baseline
}
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
