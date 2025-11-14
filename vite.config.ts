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
      input: 'test-import-syntax.js',
      external: (id) => {
        // 忽略动态导入的模块解析错误
        return id.startsWith('./home') || id.startsWith('./about') || id.startsWith('./contact')
      }
    }
  }
})