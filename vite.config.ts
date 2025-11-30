import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://47.109.198.10:8080',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
