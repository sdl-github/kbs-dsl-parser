import { createApp } from 'vue'
import App from './App.vue'

// 使用模板字符串和箭头函数
const appName = 'Vue KBS DSL Demo'
const version = '3.0'
const message = `Welcome to ${appName} v${version}!`

console.log(message)

// 箭头函数示例
const utils = {
  formatDate: (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
  capitalize: str => str.charAt(0).toUpperCase() + str.slice(1),
  delay: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

createApp(App).mount('#app')