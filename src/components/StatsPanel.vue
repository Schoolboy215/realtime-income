<script setup lang="ts">
  import { useGameStore } from '../stores/game'
  import { NCollapse, NCollapseItem, NSpace, NProgress, NEl, NTag, NCard } from 'naive-ui';
  import { computed, ref, onMounted, onUnmounted } from 'vue';
  import { formatScore, formatAge } from '../game/format';
  const game = useGameStore()

  // A dedicated reactive clock for elapsedYears() to depend on
  const now = ref(Date.now())
  let clockInterval: ReturnType<typeof setInterval>
  onMounted(() => {
    clockInterval = setInterval(() => { now.value = Date.now() }, 500)
  })
  onUnmounted(() => clearInterval(clockInterval))

  const billionaires = {
    "Elon Musk" : 147000000000, // 147 Billion
    "Mark Zuckerberg" : 39000000000, // 39 Billion
    "Jeff Bezos" : 21000000000 // 21 Billion
  }
  const billionaireRates: Record<string, string> = {
    "Elon Musk" : "147B", // 147 Billion
    "Mark Zuckerberg" : "39B", // 39 Billion
    "Jeff Bezos" : "21B" // 21 Billion
  }

  const wheelColors: Record<string, string> = {
    'Elon Musk' :'var(--error-color)',
    'Mark Zuckerberg' : 'var(--warning-color)',
    'Jeff Bezos' : 'var(--success-color)',
    'You' : 'var(--info-color)'
  }

  const regionRateText = computed(() => {
    let totalWeight = 0;
    let totalRate = 0;
    for (const unit of game.shardUnits)
    {
        totalRate += unit.rate * unit.weight;
        totalWeight += unit.weight;
    }
    let rosterCount = 0
    for (let i = 0; i < game.rosterEntries.length; i++) {
      rosterCount += game?.rosterEntries?.at(i)?.count ?? 0;
    }
    const averageRate = game.totalRate / rosterCount;
    const regionRate = totalRate / totalWeight;
    const diff = regionRate - averageRate;
    const absPercentDiff = Math.abs((diff / regionRate)* 100).toFixed(2);
    return `Your roster's average salary of $${formatScore(averageRate)} is ${absPercentDiff}% ${averageRate > regionRate ? "higher" : "lower"} than ${game.selectedRegionName}'s mean salary of $${formatScore(regionRate)}/year`;
  });

  function elapsedYears() {
    return ((now.value - game.saveStartedAt) / 1000) / 31536000;
  }

  const saveAgeText = computed(() => formatAge((now.value - game.saveStartedAt) / 1000));

  const circularPercentages = computed(() => {
    const userPercent = (game.score / game.goal) * 100 % 100;
    let percentArray = [];
    for (const value of Object.values(billionaires))
    {
        percentArray.push((value * elapsedYears() / game.goal) * 100 % 100);
    }
    percentArray.push(userPercent);
    return percentArray;
  });

  // The % 100 above discards how many full laps each ring has already made
  // around the circle. Keyed the same way as
  // wheelColors so the legend can look each one up by name.
  const laps = computed<Record<string, string>>(() => {
    const result: Record<string, string> = {
      You: formatScore(Math.floor(game.score / game.goal)),
    };
    for (const [name, value] of Object.entries(billionaires)) {
      result[name] = formatScore(Math.floor((value * elapsedYears()) / game.goal));
    }
    return result;
  });
</script>

<template>
    <n-collapse class="stats-collapse">
        <n-collapse-item>
            <template #header>
                <h2 class="stats-header">Statistics</h2>
            </template>
            <n-card>This save is {{ saveAgeText }} old.</n-card>
            <n-collapse-item>
                <template #header>
                    <h3 class="stats-header">Your roster compared to region</h3>
                </template>
                <p v-if="game.score">{{regionRateText}}</p>
                <p v-else>Start your roster to compare</p>
            </n-collapse-item>
            <n-collapse-item>
                <template #header>
                    <h3 class="stats-header">Your progress compared to a few billionaires</h3>
                </template>
                <n-space>
                    <n-el>
                    <n-progress
                        type="multiple-circle"
                        :percentage="circularPercentages"
                        :color="Object.values(wheelColors)"
                    >
                    </n-progress>
                    </n-el>
                    <n-space vertical>
                        <n-el v-for="wheel in Object.keys(billionaires)" :key="wheel">
                            <n-tag :color="{ color: wheelColors[wheel], textColor: '#FFFFFF'}" class="progress-tag">
                                <span style="flex: 1">{{wheel}}</span>
                                <span v-if="laps[wheel] != '0'" style="flex: 1"> Laps: {{ laps[wheel] }}</span>
                                <span>${{billionaireRates[wheel] }}/yr</span>
                            </n-tag>
                        </n-el>
                        <n-el>
                            <n-tag :color="{ color: wheelColors['You'], textColor: '#FFFFFF'}" class="progress-tag">
                                <span style="flex: 1">Your roster</span>
                            </n-tag>
                        </n-el>
                    </n-space>
                </n-space>
            </n-collapse-item>
        </n-collapse-item>
    </n-collapse>
</template>

<style scoped>
.stats-header {
    margin: 0;
    color: var(--muted);
}
h2 {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  margin-bottom: 0.75rem;
}
.stats-collapse :deep(.n-collapse-item__header-main) {
    justify-content: first baseline
}
.progress-tag {
    min-width: 400px;
}
.progress-tag :deep(.n-tag__content) {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0.5rem;
}
</style>