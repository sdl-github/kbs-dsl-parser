# vite-plugin-kbs-dsl

Vite plugin for transforming ES5 code to KBS DSL format.

## 安装

```bash
npm install vite-plugin-kbs-dsl
# 或
yarn add vite-plugin-kbs-dsl
# 或
pnpm add vite-plugin-kbs-dsl
```

## 使用方法

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { kbsDslParser } from 'vite-plugin-kbs-dsl'

// 保留函数名
const ignoreFNames = [
  '_applyDecoratedDescriptor',
  '_applyDecs',
  '_applyDecs2203',
  '_applyDecs2203R',
  '_applyDecs2301',
  '_applyDecs2305',
  '_arrayLikeToArray',
  '_arrayWithHoles',
  '_arrayWithoutHoles',
  '_assertThisInitialized',
  '_AsyncGenerator',
  '_asyncGeneratorDelegate',
  '_asyncIterator',
  '_asyncToGenerator',
  '_awaitAsyncGenerator',
  '_AwaitValue',
  '_checkInRHS',
  '_checkPrivateRedeclaration',
  '_classApplyDescriptorDestructureSet',
  '_classApplyDescriptorGet',
  '_classApplyDescriptorSet',
  '_classCallCheck',
  '_classCheckPrivateStaticAccess',
  '_classCheckPrivateStaticFieldDescriptor',
  '_classExtractFieldDescriptor',
  '_classNameTDZError',
  '_classPrivateFieldDestructureSet',
  '_classPrivateFieldGet',
  '_classPrivateFieldInitSpec',
  '_classPrivateFieldLooseBase',
  '_classPrivateFieldLooseKey',
  '_classPrivateFieldSet',
  '_classPrivateMethodGet',
  '_classPrivateMethodInitSpec',
  '_classPrivateMethodSet',
  '_classStaticPrivateFieldDestructureSet',
  '_classStaticPrivateFieldSpecGet',
  '_classStaticPrivateFieldSpecSet',
  '_classStaticPrivateMethodGet',
  '_classStaticPrivateMethodSet',
  '_construct',
  '_createClass',
  '_createForOfIteratorHelper',
  '_createForOfIteratorHelperLoose',
  '_createSuper',
  '_decorate',
  '_defaults',
  '_defineAccessor',
  '_defineEnumerableProperties',
  '_defineProperty',
  '_dispose',
  '_extends',
  '_get',
  '_getPrototypeOf',
  '_identity',
  '_inherits',
  '_inheritsLoose',
  '_initializerDefineProperty',
  '_initializerWarningHelper',
  '_instanceof',
  '_interopRequireDefault',
  '_interopRequireWildcard',
  '_isNativeFunction',
  '_isNativeReflectConstruct',
  '_iterableToArray',
  '_iterableToArrayLimit',
  '_iterableToArrayLimitLoose',
  '_jsx',
  '_maybeArrayLike',
  '_newArrowCheck',
  '_nonIterableRest',
  '_nonIterableSpread',
  '_objectDestructuringEmpty',
  '_objectSpread',
  '_objectSpread2',
  '_objectWithoutProperties',
  '_objectWithoutPropertiesLoose',
  '_OverloadYield',
  '_possibleConstructorReturn',
  '_readOnlyError',
  '_regeneratorRuntime',
  '_set',
  '_setPrototypeOf',
  '_skipFirstGeneratorNext',
  '_slicedToArray',
  '_slicedToArrayLoose',
  '_superPropBase',
  '_taggedTemplateLiteral',
  '_taggedTemplateLiteralLoose',
  '_tdz',
  '_temporalRef',
  '_temporalUndefined',
  '_toArray',
  '_toConsumableArray',
  '_toPrimitive',
  '_toPropertyKey',
  '_typeof',
  '_unsupportedIterableToArray',
  '_using',
  '_wrapAsyncGenerator',
  '_wrapNativeSuper',
  '_wrapRegExp',
  '_writeOnlyError',
]

export default defineConfig({
  plugins: [
    kbsDslParser({
      compress: process.env.COMPRESS === 'yes', // 是否压缩代码
      ignoreFNames, // 保留的函数名列表：默认为 @babel/runtime/helpers
      watch: true, // 是否开启监听
      watchOptions: {
        protocol: 'ws', // 只有这个选项
        host: 'localhost', // 如果不想用 localhost 可以传值进去
        port: 9900 // 端口
      },
      test: (id) => id.endsWith('.js') // 自定义文件过滤规则
    })
  ]
})
```

### JavaScript 配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { kbsDslParser } from 'vite-plugin-kbs-dsl'

export default defineConfig({
  plugins: [
    kbsDslParser({
      compress: false,
      watch: true,
      watchOptions: {
        port: 9900
      }
    })
  ]
})
```

## 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `compress` | `boolean` | `false` | 是否压缩生成的 DSL 代码 |
| `ignoreFNames` | `string[]` | `[]` | 保留的函数名列表，通常用于 @babel/runtime/helpers |
| `watch` | `boolean` | `false` | 是否开启 WebSocket 监听模式 |
| `watchOptions` | `object` | `{ port: 9900, host: 'localhost', protocol: 'ws' }` | WebSocket 服务器配置 |
| `test` | `function` | `() => true` | 文件过滤函数，接收文件 ID，返回布尔值 |

## 功能特性

- ✅ 支持 Vite 4.x 和 5.x
- ✅ TypeScript 支持
- ✅ ES 模块格式
- ✅ WebSocket 实时监听
- ✅ 自定义文件过滤
- ✅ 代码压缩选项
- ✅ 完整的 ES5 语法支持
- ✅ ES6+ 语法支持（模板字符串、箭头函数等）
- ✅ Vue 项目兼容性

## 输出

插件会为每个匹配的 `.js` 文件生成对应的 `.dsl.json` 文件，包含转换后的 KBS DSL 结构。

## 支持的语法

### ES5 语法
- 变量声明 (`var`, `let`, `const`)
- 函数声明和表达式
- 条件语句 (`if/else`, `switch`)
- 循环语句 (`for`, `while`, `do-while`, `for-in`)
- 异常处理 (`try/catch/finally`)
- 对象和数组字面量
- 所有运算符和表达式

### ES6+ 语法
- **模板字符串**: `\`Hello ${name}!\`` → `templateLiteral` 调用
- **箭头函数**: `(a, b) => a + b` → 标准函数表达式
- **for...of 循环**: `for (const item of array)` → `callForOf` 调用
- **展开语法**: `...array` → `spreadElement` 调用
- **类声明**: `class MyClass` → 函数声明 + 原型方法
- **类表达式**: `const MyClass = class {}` → IIFE 包装的类声明
- **解构赋值**: 基本支持数组和对象解构

### Vue 项目支持
插件已经过 Vue 3 项目测试，能够正确处理 Vue 编译后的 JavaScript 代码。
```
