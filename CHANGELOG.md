# Changelog

## [2.8.0] - 2024-11-14

### ✨ New Features
- 添加对 `AwaitExpression` (await 表达式) 的支持
- 改进对象表达式解析的错误处理
- 完整的 React 项目支持和测试
- 支持 async/await 语法的 DSL 转换

### 🐛 Bug Fixes
- 修复 "意料之外的 expression 类型：AwaitExpression" 错误
- 修复对象表达式中 undefined 属性导致的解析错误
- 改进对象属性的空值处理

### 🔧 Technical Changes
- 添加 `awaitExpression` DSL 函数类型
- 改进 `parseObjectExpression` 的错误处理
- 支持 React JSX 语法的完整转换

### 📦 React 项目支持
- ✅ **React Hooks**: `useState`, `useEffect` 等
- ✅ **JSX 语法**: `React.createElement` 调用转换
- ✅ **事件处理**: onClick 等事件处理函数
- ✅ **条件渲染**: 三元运算符和条件表达式
- ✅ **列表渲染**: `map` 函数和展开语法
- ✅ **异步操作**: async/await 语法支持

### 🧪 测试项目
创建了完整的 React 测试项目 (`example-react/`)，包含：
- React Hooks 使用示例
- 复杂的 JSX 结构
- 事件处理和状态管理
- 动态导入和懒加载
- 现代 JavaScript 语法

## [2.7.0] - 2024-11-14

### ✨ New Features
- 添加 HTML 注入功能：自动为 `<script>` 标签添加 `mp-web-package-url` 属性
- 新增 `injectHtmlAttribute` 配置选项（默认启用）
- 使用 Vite 的 `transformIndexHtml` 钩子处理 HTML 文件
- 支持在运行时通过 HTML 属性获取 DSL 文件路径

### 🔧 Technical Changes
- 添加 `transformIndexHtml` 钩子，在构建后期修改 HTML
- 使用正则表达式匹配和替换 `<script>` 标签
- 自动生成对应的 DSL 文件路径
- 支持配置是否启用 HTML 属性注入

### 📦 HTML 注入示例
```html
<!-- 之前 -->
<script type="module" crossorigin src="/assets/index-VzG3rHVd.js"></script>

<!-- 之后 -->
<script type="module" crossorigin src="/assets/index-VzG3rHVd.js" mp-web-package-url="/assets/index-VzG3rHVd.dsl.json"></script>
```

### ⚙️ 配置选项
```typescript
kbsDslParser({
  injectHtmlAttribute: true, // 默认启用，设为 false 可禁用
  // ... 其他选项
})
```

## [2.6.0] - 2024-11-14

### ✨ New Features

- 添加对动态导入 (`import()`) 的支持
- 支持 `Import` 表达式类型
- 改进 `CallExpression` 处理，特殊识别动态导入调用
- 支持条件动态导入和工厂函数模式

### 🐛 Bug Fixes

- 修复 "意料之外的 expression 类型：Import" 错误
- 改进动态导入在不同上下文中的处理

### 🔧 Technical Changes

- 添加 `dynamicImport` DSL 函数类型
- 添加 `getImport` DSL 函数类型
- 在 `parseCallExpression` 中特殊处理 `Import` callee
- 支持动态导入的各种使用模式

### 📦 动态导入语法支持

- ✅ **基本动态导入**: `import('./module.js')`
- ✅ **条件动态导入**: `condition ? import('./a.js') : import('./b.js')`
- ✅ **工厂函数**: `() => import('./module.js')`
- ✅ **路由懒加载**: `{ component: () => import('./Component.vue') }`
- ✅ **变量路径**: `import(modulePath)`
- ✅ **模板字符串路径**: `import(\`./\${name}.js\`)`

## [2.5.0] - 2024-11-14

### ✨ New Features

- 添加对 ES 模块导入导出语法的完整支持
- 支持 `ExportNamedDeclaration` (命名导出)
- 支持 `ExportDefaultDeclaration` (默认导出)
- 支持 `ExportAllDeclaration` (全部导出)
- 支持 `ImportDeclaration` (导入声明)
- 支持各种导入导出模式和重新导出

### 🐛 Bug Fixes

- 修复 "意料之外的 esTree node: ExportNamedDeclaration" 错误
- 改进模块语句的处理和排序逻辑

### 🔧 Technical Changes

- 添加 `exportNamed`, `exportDefault`, `exportAll` DSL 函数类型
- 添加 `importDefault`, `importNamespace`, `importNamed` DSL 函数类型
- 改进语句排序：导入语句前置，导出语句正常顺序
- 支持导入导出语句返回数组的情况

### 📦 ES 模块语法支持

- ✅ **命名导出**: `export const name = value`
- ✅ **函数导出**: `export function myFunc() {}`
- ✅ **类导出**: `export class MyClass {}`
- ✅ **默认导出**: `export default value`
- ✅ **重新导出**: `export { name } from 'module'`
- ✅ **全部导出**: `export * from 'module'`
- ✅ **默认导入**: `import defaultExport from 'module'`
- ✅ **命名导入**: `import { name } from 'module'`
- ✅ **命名空间导入**: `import * as name from 'module'`

## [2.4.0] - 2024-11-14

### ✨ New Features

- 添加对 `import.meta` 的支持
- 添加对可选链操作符 (`?.`) 的支持
- 添加对可选调用 (`func?.()`) 的支持
- 改进 Babel 解析器配置，支持更多现代 JavaScript 语法
- 添加对 TypeScript、JSX 等语法的解析支持

### 🐛 Bug Fixes

- 修复 "import.meta may appear only with 'sourceType: \"module\"'" 错误
- 改进解析器配置，支持模块语法和现代 JavaScript 特性

### 🔧 Technical Changes

- 配置 Babel 解析器支持 ES 模块 (`sourceType: 'module'`)
- 添加多个 Babel 插件支持现代语法
- 添加 `getImportMeta`, `optionalMember`, `optionalCall` DSL 函数类型
- 支持 `allowImportExportEverywhere` 和 `allowReturnOutsideFunction`

### 📦 解析器插件支持

- ✅ JSX 语法
- ✅ TypeScript 语法
- ✅ 装饰器 (decorators-legacy)
- ✅ 类属性 (classProperties)
- ✅ 对象展开 (objectRestSpread)
- ✅ 函数绑定 (functionBind)
- ✅ 导出语法扩展
- ✅ 动态导入 (dynamicImport)
- ✅ 空值合并 (nullishCoalescingOperator)
- ✅ 可选链 (optionalChaining)
- ✅ import.meta (importMeta)

## [2.3.0] - 2024-11-14

### ✨ New Features

- 添加对 `ClassExpression` (类表达式) 的支持
- 类表达式转换为立即执行函数表达式 (IIFE)
- 支持匿名类表达式和命名类表达式
- 支持类表达式的继承

### 🐛 Bug Fixes

- 修复 "意料之外的 expression 类型：ClassExpression" 错误
- 改进类表达式在复杂场景下的处理

### 🔧 Technical Changes

- 类表达式转换为 IIFE 包装的类声明
- 自动生成匿名类的唯一名称
- 保持类表达式的作用域特性

### ✅ 完整的类支持

- ✅ 类声明 (`class MyClass {}`)
- ✅ 类表达式 (`const MyClass = class {}`)
- ✅ 匿名类表达式 (`new (class {})()`)
- ✅ 类继承 (`class Child extends Parent {}`)

## [2.2.0] - 2024-11-14

### ✨ New Features

- 添加对 `ForOfStatement` (for...of 循环) 的支持
- 添加对 `SpreadElement` (展开语法) 的支持
- 添加对 `ClassDeclaration` (类声明) 的支持
- 添加对解构赋值的基本支持
- 改进函数参数处理，支持复杂参数类型

### 🐛 Bug Fixes

- 修复 "意料之外的 esTree node: ForOfStatement" 错误
- 修复 "意料之外的 expression 类型：SpreadElement" 错误
- 修复 "意料之外的 esTree node: ClassDeclaration" 错误
- 修复函数参数为 null 时的解构错误
- 修复 Vue 项目构建时的各种语法解析错误

### 🔧 Technical Changes

- 添加 `callForOf` DSL 函数类型
- 添加 `spreadElement` DSL 函数类型
- 添加 `classExtends` DSL 函数类型
- 添加 `destructureAssign` DSL 函数类型
- 添加多种解构模式类型支持
- 改进类声明转换为函数和原型方法的逻辑

### ✅ Vue 兼容性

- 完全支持 Vue 3 项目构建
- 正确处理 Vue 编译后的复杂 JavaScript 代码
- 生成完整的 DSL 文件（示例：721KB DSL 输出）

## [2.1.0] - 2024-11-14

### ✨ New Features

- 添加对 ES6+ 语法的支持
- 支持模板字符串 (TemplateLiteral) 解析
- 支持箭头函数 (ArrowFunctionExpression) 解析
- 修复 Vue 项目构建时的解析错误

### 🐛 Bug Fixes

- 修复 "意料之外的 expression 类型：TemplateLiteral" 错误
- 改进对现代 JavaScript 语法的兼容性

### 🔧 Technical Changes

- 添加 `templateLiteral` DSL 函数类型
- 箭头函数转换为标准函数表达式
- 模板字符串转换为字符串拼接操作

## [2.0.0] - 2024-11-14

### 🚀 Major Changes

- **BREAKING**: 项目从 webpack 插件重构为 vite 插件
- **BREAKING**: 包名从 `kbs-dsl-parser` 更改为 `vite-plugin-kbs-dsl`
- **BREAKING**: 从 CommonJS 迁移到 ES 模块

### ✨ New Features

- 完整的 TypeScript 支持
- 支持 Vite 4.x 和 5.x
- 新增 `test` 选项用于自定义文件过滤
- 现代化的构建系统（使用 tsup）

### 🔧 Technical Changes

- 使用 ES 模块格式
- 添加完整的类型定义
- 保持所有原有的 DSL 转换逻辑
- 保持 WebSocket 实时监听功能

### 📦 Package Changes

- 新包名: `vite-plugin-kbs-dsl`
- 新的导入方式: `import { kbsDslParser } from 'vite-plugin-kbs-dsl'`
- 支持 tree-shaking

### 🏗️ Build System

- 使用 tsup 进行构建
- 生成 ESM 格式输出
- 包含类型声明文件

### 📚 Documentation

- 更新了完整的使用文档
- 添加了迁移指南
- 包含了示例项目

### 🧪 Testing

- ✅ 基本 ES5 到 DSL 转换测试通过
- ✅ 复杂代码转换测试通过
- ✅ 文件过滤功能测试通过
- ✅ 代码压缩选项测试通过

## Migration Guide

### 从 1.x 迁移到 2.x

#### 安装

```bash
# 卸载旧版本
npm uninstall kbs-dsl-parser

# 安装新版本
npm install vite-plugin-kbs-dsl
```

#### 配置更新

```javascript
// 之前 (webpack)
const KbsDslParserPlugin = require("kbs-dsl-parser");

module.exports = {
  plugins: [new KbsDslParserPlugin(options)],
};

// 现在 (vite)
import { kbsDslParser } from "vite-plugin-kbs-dsl";

export default defineConfig({
  plugins: [kbsDslParser(options)],
});
```

#### 新增选项

- `test`: 函数，用于自定义文件过滤规则

#### 保持不变的功能

- 所有 DSL 转换逻辑保持完全一致
- WebSocket 监听功能保持不变
- 压缩和忽略函数名功能保持不变
