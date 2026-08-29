import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // Served from the root of the custom domain (realtime-income.mckay.me), so the
  // default base is correct. The old github.io/realtime-income/ project path now
  // just redirects here.
  base: '/',
  plugins: [vue()],
})
