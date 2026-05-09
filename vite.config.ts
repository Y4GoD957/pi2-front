import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) {
              return 'supabase-vendor'
            }

            if (id.includes('@tanstack/react-router')) {
              return 'router-vendor'
            }

            if (id.includes('leaflet')) {
              return 'leaflet-vendor'
            }

            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
