import type { Plugin } from 'vite'
import { WebSocketServer } from 'ws'
import { parse } from '@babel/parser'
import { dslParse } from './parser'

export interface KbsDslParserOptions {
  compress?: boolean
  ignoreFNames?: string[]
  watch?: boolean
  watchOptions?: {
    protocol?: 'ws'
    host?: string
    port?: number
  }
  test?: (id: string) => boolean
  injectHtmlAttribute?: boolean
}

const defaultWatchOptions = {
  port: 9900,
  host: 'localhost',
  protocol: 'ws' as const
}

export function kbsDslParser(options: KbsDslParserOptions = {}): Plugin {
  const {
    compress = false,
    ignoreFNames = [],
    watch = false,
    watchOptions,
    test = () => true,
    injectHtmlAttribute = true
  } = options

  const wsOptions = { ...defaultWatchOptions, ...watchOptions }
  let websocketServer: WebSocketServer | null = null
  let send: (data: string) => void = () => {}
  const dslStrMap: Record<string, string> = {}

  return {
    name: 'kbs-dsl-parser',
    
    configResolved() {
      if (watch) {
        websocketServer = new WebSocketServer({ port: wsOptions.port })
        console.log('WebSocket 服务创建成功!')
        
        websocketServer.on('connection', (ws) => {
          console.log('WebSocket 连接成功')
          send = (data: string) => {
            ws.send(data)
          }
          
          ws.on('close', () => {
            console.log('WebSocket 断开')
            send = () => {}
          })
        })
      }
    },

    generateBundle(_, bundle) {
      const jsFileToDslMap = new Map<string, string>()
      
      Object.entries(bundle).forEach(([fileName, chunk]) => {
        if (chunk.type !== 'chunk' || !fileName.endsWith('.js') || !test(fileName)) {
          return
        }

        try {
          const ast = parse(chunk.code, {
            sourceType: 'module',
            allowImportExportEverywhere: true,
            allowReturnOutsideFunction: true,
            plugins: [
              'jsx',
              'typescript',
              'decorators-legacy',
              'classProperties',
              'objectRestSpread',
              'functionBind',
              'exportDefaultFrom',
              'exportNamespaceFrom',
              'dynamicImport',
              'nullishCoalescingOperator',
              'optionalChaining',
              'importMeta'
            ]
          })
          const dsl = dslParse(ast, compress, ignoreFNames)
          const dslStr = JSON.stringify(dsl)
          
          const dslFileName = fileName.replace(/\.js$/, '.dsl.json')
          
          // 生成 DSL 文件
          this.emitFile({
            type: 'asset',
            fileName: dslFileName,
            source: dslStr
          })

          // 记录 JS 文件到 DSL 文件的映射
          jsFileToDslMap.set(fileName, dslFileName)

          if (watch) {
            dslStrMap[fileName] = dslStr
          }
        } catch (error) {
          console.error(`解析文件 ${fileName} 时出错:`, error)
        }
      })

      // 处理 HTML 文件，添加 mp-web-package-url 属性
      Object.entries(bundle).forEach(([fileName, chunk]) => {
        if (chunk.type === 'asset' && fileName.endsWith('.html')) {
          let htmlContent = chunk.source as string
          
          // 更灵活的正则表达式来匹配 script 标签
          htmlContent = htmlContent.replace(
            /<script([^>]*?)src="([^"]*\.js)"([^>]*?)>/g,
            (match, beforeSrc, jsPath, afterSrc) => {
              // 提取文件名（去掉路径前缀）
              const jsFileName = jsPath.replace(/^.*\//, '')
              const dslFileName = jsFileToDslMap.get(jsFileName)
              
              if (dslFileName) {
                const dslPath = jsPath.replace(/\.js$/, '.dsl.json')
                // 检查是否已经有 mp-web-package-url 属性
                if (!match.includes('mp-web-package-url=')) {
                  // 在 > 之前添加属性
                  return `<script${beforeSrc}src="${jsPath}"${afterSrc} mp-web-package-url="${dslPath}">`
                }
              }
              return match
            }
          )
          
          // 更新 HTML 文件内容
          chunk.source = htmlContent
        }
      })
    },

    buildEnd() {
      if (watch && Object.keys(dslStrMap).length > 0) {
        setTimeout(() => {
          Object.entries(dslStrMap).forEach(([entry, dslStr]) => {
            console.log('更新文件：', entry)
            send(JSON.stringify({
              entry,
              dslStr
            }))
          })
          // 清空
          Object.keys(dslStrMap).forEach(key => delete dslStrMap[key])
        }, 0)
      }
    },

    buildStart() {
      // 清空之前的映射
      Object.keys(dslStrMap).forEach(key => delete dslStrMap[key])
    },

    transformIndexHtml: injectHtmlAttribute ? {
      order: 'post',
      handler(html, context) {
        // 在 HTML 转换的最后阶段添加 mp-web-package-url 属性
        return html.replace(
          /<script([^>]*?)src="([^"]*\.js)"([^>]*?)>/g,
          (match, beforeSrc, jsPath, afterSrc) => {
            // 提取文件名（去掉路径前缀）
            const jsFileName = jsPath.replace(/^.*\//, '')
            
            // 检查是否已经有 mp-web-package-url 属性
            if (!match.includes('mp-web-package-url=')) {
              const dslPath = jsPath.replace(/\.js$/, '.dsl.json')
              return `<script${beforeSrc}src="${jsPath}"${afterSrc} mp-web-package-url="${dslPath}">`
            }
            return match
          }
        )
      }
    } : undefined
  }
}

export default kbsDslParser