// 测试动态导入语法

async function loadModule() {
  try {
    // 动态导入模块
    const module = await import('./some-module.js')
    console.log('Module loaded:', module.default)
    
    // 条件动态导入
    if (typeof window !== 'undefined') {
      const { createApp } = await import('vue')
      console.log('Vue loaded:', createApp)
    }
    
    // 动态导入 JSON
    const config = await import('./config.json')
    console.log('Config loaded:', config)
    
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
    component: () => import('./components/Home.vue')
  },
  {
    path: '/about',
    component: () => import('./components/About.vue')
  }
]

// 执行测试
loadModule().then(result => {
  console.log('Dynamic import test completed:', result)
})

const homeLoader = createLazyLoader('./components/Home.vue')
console.log('Lazy loader created:', homeLoader)