# Changelog

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