import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 使用现代 JavaScript 语法
const appName = 'React KBS DSL Demo'
const version = '18.2'
const message = `Welcome to ${appName} v${version}!`

console.log(message)

// 箭头函数和解构
const utils = {
  formatDate: (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
  capitalize: str => str.charAt(0).toUpperCase() + str.slice(1),
  delay: async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 动态导入示例
async function loadComponent() {
  try {
    // 条件动态导入
    if (typeof window !== 'undefined') {
      const { default: LazyComponent } = await import('./components/LazyComponent.jsx')
      console.log('Lazy component loaded:', LazyComponent)
    }
  } catch (error) {
    console.error('Failed to load component:', error)
  }
}

// 类组件示例
class Logger {
  constructor(name) {
    this.name = name
    this.logs = []
  }
  
  log(message) {
    const timestamp = new Date().toISOString()
    this.logs.push({ message, timestamp })
    console.log(`[${this.name}] ${message}`)
  }
  
  getLogs() {
    return [...this.logs]
  }
}

const logger = new Logger('ReactApp')
logger.log('Application starting...')

// 启动 React 应用
ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(React.StrictMode, null,
    React.createElement(App, null)
  )
)

// 测试各种语法
const testFeatures = () => {
  // 模板字符串
  const greeting = `Hello from ${appName}!`
  
  // 可选链
  const config = { app: { theme: 'dark' } }
  const theme = config?.app?.theme ?? 'light'
  
  // 展开语法
  const numbers = [1, 2, 3]
  const moreNumbers = [...numbers, 4, 5, 6]
  
  // for...of 循环
  for (const num of moreNumbers) {
    logger.log(`Processing number: ${num}`)
  }
  
  logger.log(`Theme: ${theme}`)
  logger.log(`Numbers: ${moreNumbers.join(', ')}`)
}

testFeatures()
loadComponent()