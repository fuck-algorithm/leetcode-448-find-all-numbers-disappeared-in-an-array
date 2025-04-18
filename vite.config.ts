import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/fuck-algorithm/leetcode-448-find-all-numbers-disappeared-in-an-array/',
})
