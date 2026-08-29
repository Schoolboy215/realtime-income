import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves a project site from https://<user>.github.io/realtime-income/,
  // so the production build needs that subpath as its base. Locally (`npm run dev`)
  // and anywhere else, serve from root.
  base: process.env.GITHUB_ACTIONS ? '/realtime-income/' : '/',
  plugins: [vue()],
})
