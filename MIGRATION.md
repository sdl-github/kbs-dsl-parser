# vite-plugin-kbs-dsl 迁移指南：从 Webpack 插件到 Vite 插件

## 重构完成的功能

✅ **已完成的重构内容：**

1. **项目结构现代化**
   - 转换为 TypeScript 项目
   - 使用 ES 模块格式
   - 添加完整的类型定义

2. **构建系统升级**
   - 从 CommonJS 迁移到 ES 模块
   - 使用 tsup 进行构建
   - 支持 Vite 4.x 和 5.x

3. **插件架构重写**
   - 从 Webpack 插件 API 迁移到 Vite 插件 API
   - 保持原有的 DSL 转换逻辑
   - 支持 WebSocket 实时监听

4. **功能验证**
   - ✅ ES5 到 KBS DSL 转换正常工作
   - ✅ 生成 `.dsl.json` 文件
   - ✅ 支持文件过滤
   - ✅ 支持代码压缩选项

## 使用方法对比

### 之前 (Webpack)
```javascript
const KbsDslParserPlugin = require('vite-plugin-kbs-dsl');

module.exports = {
  plugins: [
    new KbsDslParserPlugin({
      compress: false,
      ignoreFNames: [...],
      watch: true,
      watchOptions: { port: 9900 }
    })
  ]
}
```

### 现在 (Vite)
```typescript
import { defineConfig } from 'vite'
import { kbsDslParser } from 'vite-plugin-kbs-dsl'

export default defineConfig({
  plugins: [
    kbsDslParser({
      compress: false,
      ignoreFNames: [...],
      watch: true,
      watchOptions: { port: 9900 },
      test: (id) => id.endsWith('.js')
    })
  ]
})
```

## 主要变化

1. **导入方式**：从 `require()` 改为 `import`
2. **实例化**：从 `new Plugin()` 改为直接调用函数
3. **新增选项**：添加了 `test` 函数用于文件过滤
4. **类型支持**：完整的 TypeScript 类型定义

## 测试验证

项目包含了完整的测试示例：

```bash
# 构建项目
npm run build

# 测试插件功能
npx vite build

# 查看生成的 DSL 文件
ls dist/assets/*.dsl.json
```

## 示例项目

在 `example/` 目录中包含了一个完整的使用示例，展示了如何在实际项目中使用重构后的插件。

## 兼容性

- **Node.js**: >= 16.0.0
- **Vite**: >= 4.0.0
- **TypeScript**: >= 5.0.0 (可选)

## 下一步

项目已成功从 Webpack 插件重构为 Vite 插件，保持了所有原有功能的同时，提供了更好的开发体验和类型安全。