import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 依你的 Pages 路徑調整：
export default defineConfig({
  plugins: [react()],
  base: '/othello-react/react/'
})

