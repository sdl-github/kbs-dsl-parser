// 测试动态导入语法（简化版）

async function loadModule() {
  try {
    // 动态导入模块（字符串路径）
    const modulePath = './utils.js'
    const module = await import(modulePath)
    console.log('Module loaded:', module.default)
    
    // 条件动态导入
    if (Math.random() > 0.5) {
      const helper = await import('./helper.js')
      console.log('Helper loaded:', helper)
    }
    
    return module
  } catch (error) {
    console.error('Failed to load module:', error)
  }
}

// 使用动态导入的工厂函数
function createLazyLoader(modulePath) {
  return () => import(modulePath)
}

// 路由懒加载示例
const routes = [
  {
    path: '/home',
    component: () => import('./Home.js')
  },
  {
    path: '/about', 
    component: () => import('./About.js')
  }
]

// 动态导入表达式
const dynamicPath = './config'
const configLoader = import(dynamicPath + '.js')

// 执行测试
loadModule().then(result => {
  console.log('Dynamic import test completed:', result)
}).catch(err => {
  console.error('Test failed:', err)
})

const homeLoader = createLazyLoader('./Home.js')
console.log('Lazy loader created:', homeLoader)

console.log('Routes configured:', routes.length)