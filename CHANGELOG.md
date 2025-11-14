# Changelog

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
const KbsDslParserPlugin = require('kbs-dsl-parser')

module.exports = {
  plugins: [
    new KbsDslParserPlugin(options)
  ]
}

// 现在 (vite)
import { kbsDslParser } from 'vite-plugin-kbs-dsl'

export default defineConfig({
  plugins: [
    kbsDslParser(options)
  ]
})
```

#### 新增选项
- `test`: 函数，用于自定义文件过滤规则

#### 保持不变的功能
- 所有 DSL 转换逻辑保持完全一致
- WebSocket 监听功能保持不变
- 压缩和忽略函数名功能保持不变