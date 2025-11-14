// 测试 ES 模块导入导出语法

// 导入语句
import { createApp } from 'vue'
import * as utils from './utils'
import defaultExport from './default-module'

// 命名导出
export const PI = 3.14159
export let counter = 0
export var message = 'Hello, World!'

// 函数导出
export function increment() {
  counter++
  return counter
}

// 类导出
export class Calculator {
  constructor(initial = 0) {
    this.value = initial
  }
  
  add(num) {
    this.value += num
    return this
  }
}

// 重新导出
export { createApp } from 'vue'
export { default as MyComponent } from './MyComponent'

// 默认导出
const app = {
  name: 'MyApp',
  version: '1.0.0',
  start() {
    console.log(`Starting ${this.name} v${this.version}`)
  }
}

export default app

// 全部导出
export * from './all-exports'

console.log('Module loaded successfully')