import React from 'react'

// 懒加载组件示例
const LazyComponent = () => {
  const features = [
    'ES6+ 语法支持',
    '模板字符串转换',
    '箭头函数处理',
    'for...of 循环支持',
    '展开语法转换',
    '类声明和表达式',
    '动态导入处理',
    'JSX 语法解析'
  ]

  return React.createElement('div', { className: 'lazy-component' },
    React.createElement('h3', null, 'KBS DSL 插件特性'),
    React.createElement('ul', null,
      ...features.map((feature, index) =>
        React.createElement('li', { key: index }, feature)
      )
    ),
    React.createElement('p', null, '这个组件通过动态导入加载，测试 import() 语法的 DSL 转换。')
  )
}

export default LazyComponent