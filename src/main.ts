import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { useGameStore } from './stores/game'
import { writeSave } from './game/storage'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// useGameStore() normally only works inside a component's setup(), where
// Pinia can find the "active" instance automatically. Here, outside any
// component, we pass `pinia` explicitly instead.
const game = useGameStore(pinia)

// The tick loop mutates `score` ~10x/second, and $subscribe fires on every
// mutation — writing to localStorage that often is wasted work for no
// benefit, so routine writes are throttled to once per SAVE_THROTTLE_MS.
// The visibilitychange/beforeunload handlers below are the real safety net
// for "closed the tab right after picking something," bypassing the
// throttle so that doesn't get lost.
const SAVE_THROTTLE_MS = 5000
let lastWriteAt = 0

function persist() {
  writeSave({
    version: 3,
    score: game.score,
    roster: game.roster,
    selectedRegionCode: game.selectedRegionCode,
    selectedRegionName: game.selectedRegionName,
    choices: game.choices,
    lastSaveTime: Date.now(),
  })
  lastWriteAt = Date.now()
}

game.$subscribe(() => {
  if (Date.now() - lastWriteAt >= SAVE_THROTTLE_MS) persist()
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') persist()
})
window.addEventListener('beforeunload', persist)

app.mount('#app')
