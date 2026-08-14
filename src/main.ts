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

// Persist to localStorage after every state change, whatever it was.
game.$subscribe((_mutation, state) => {
  writeSave({
    version: 1,
    score: state.score,
    roster: state.roster,
    choices: state.choices,
  })
})

app.mount('#app')
