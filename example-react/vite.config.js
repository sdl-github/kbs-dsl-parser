import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { kbsDslParser } from '../dist/index.js'

export default defineConfig({
  plugins: [
    react(),
    kbsDslParser({
      compress: false,
      watch: false,
      test: (id) => id.endsWith('.js') && !id.includes('node_modules'),
      injectHtmlAttribute: true
    })
  ]
})