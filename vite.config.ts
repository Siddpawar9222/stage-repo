import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env.{mode} files
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH || '/',
    server: {
      open: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: 'src/setupTests',
      mockReset: true,
    },
    build: {
      chunkSizeWarningLimit: 1000, // Increase limit to suppress warning
    },
  }
})
