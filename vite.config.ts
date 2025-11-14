import { defineConfig } from 'vite'
import { kbsDslParser } from './src/index.js'

export default defineConfig({
  plugins: [
    kbsDslParser({
      compress: false,
      watch: false,
      test: (id) => id.endsWith('.js')
    })
  ],
  build: {
    rollupOptions: {
      input: 'test.js'
    }
  }
})