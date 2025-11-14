# React + KBS DSL 测试项目

这是一个用于测试 `vite-plugin-kbs-dsl` 插件在 React 项目中功能的示例项目。

## 功能特性

### React 功能测试
- ✅ **React Hooks**: useState, useEffect
- ✅ **JSX 语法**: React.createElement 转换
- ✅ **事件处理**: onClick, onChange 等
- ✅ **条件渲染**: 三元运算符
- ✅ **列表渲染**: map 函数和 key 属性
- ✅ **状态管理**: 计数器和 Todo 列表

### 现代 JavaScript 语法测试
- ✅ **模板字符串**: `\`Hello ${name}!\``
- ✅ **箭头函数**: `(a, b) => a + b`
- ✅ **解构赋值**: `const { name } = obj`
- ✅ **展开语法**: `[...array]`
- ✅ **async/await**: 异步函数处理
- ✅ **动态导入**: `import('./Component.jsx')`
- ✅ **可选链**: `obj?.prop?.method?.()`
- ✅ **空值合并**: `value ?? default`

## 构建结果

运行 `npm run build` 后会生成：

```
dist/
├── index.html                                  # HTML 文件（包含 mp-web-package-url 属性）
├── assets/
│   ├── index-DjgJJ1Km.js                      # 主应用 JS 文件
│   ├── index-DjgJJ1Km.dsl.json               # 主应用 DSL 文件 (1.72MB)
│   ├── LazyComponent-wjIn3GNp.js             # 懒加载组件 JS 文件
│   ├── LazyComponent-wjIn3GNp.dsl.json       # 懒加载组件 DSL 文件 (2.35KB)
│   └── index-BcENU6gU.css                    # 样式文件
```

## HTML 属性注入

生成的 HTML 文件中的 script 标签会自动添加 `mp-web-package-url` 属性：

```html
<script type="module" crossorigin src="/assets/index-DjgJJ1Km.js" 
        mp-web-package-url="/assets/index-DjgJJ1Km.dsl.json"></script>
```

## DSL 转换示例

### JSX 转换
```javascript
// 原始 JSX
React.createElement('div', { className: 'app' }, 'Hello World')

// DSL 输出
{
  "type": "call-function",
  "name": "callFun",
  "value": [
    {
      "type": "member",
      "value": ["$", "createElement"]
    },
    [
      { "type": "literal", "value": "div" },
      {
        "type": "object-literal",
        "value": [
          {
            "key": "className",
            "value": { "type": "literal", "value": "app" }
          }
        ]
      },
      { "type": "literal", "value": "Hello World" }
    ]
  ]
}
```

### Hooks 转换
```javascript
// 原始代码
const [count, setCount] = useState(0)

// DSL 输出
{
  "type": "call-function",
  "name": "batchDeclaration",
  "value": [
    "const",
    [
      {
        "key": "destructured_array",
        "value": {
          "type": "call-function",
          "name": "callFun",
          "value": [
            { "type": "call-function", "name": "getConst", "value": "useState" },
            [{ "type": "literal", "value": 0 }]
          ]
        }
      }
    ]
  ]
}
```

## 运行项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 技术栈

- **React 18.2**: 现代 React 框架
- **Vite 5**: 快速构建工具
- **vite-plugin-kbs-dsl**: KBS DSL 转换插件
- **@vitejs/plugin-react**: React 支持插件