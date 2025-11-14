import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { kbsDslParser } from '../dist/index.js'

export default defineConfig({
  plugins: [
    vue(),
    kbsDslParser({
      compress: false,
      watch: false,
      test: (id) => id.endsWith('.js') && !id.includes('node_modules')
    })
  ]
})