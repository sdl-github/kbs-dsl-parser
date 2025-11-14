// 测试 ES 模块导入导出语法（简化版）

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

// 默认导出
const app = {
  name: 'MyApp',
  version: '1.0.0',
  start() {
    console.log(`Starting ${this.name} v${this.version}`)
  }
}

export default app

// 使用导出的内容
console.log('PI:', PI)
console.log('Counter:', increment())
console.log('Message:', message)

const calc = new Calculator(10)
console.log('Calculator result:', calc.add(5).value)

app.start()