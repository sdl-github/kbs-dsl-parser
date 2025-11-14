import type { Node, Statement, Expression, Program } from '@babel/types'
import { getCallFunName, getTypeName, getKeyName } from './utils'

// 不需要处理的类型
const ignoreTypes = [
  'DebuggerStatement',
  'Directive',
  'EmptyStatement'
]

// 报错的类型
const unSupportTypes = [
  'WithStatement',
  'Patterns'
]

let compress = false
let ignoreFNames: string[] = []

// 「提升的变量」的栈
const raiseVarStack: string[][] = []

// 向栈内添加变量
const addRaiseVars = (raiseVars: string[], raiseVarStackTail: string[]) => {
  raiseVars.forEach(raiseVar => {
    if (!raiseVarStackTail.includes(raiseVar)) {
      raiseVarStackTail.push(raiseVar)
    }
  })
}

const es5ToDsl = (body: Statement[], scopeBlock = false): any[] => {
  if (scopeBlock) {
    // 有作用域块（这里专指函数的作用域）
    raiseVarStack.push([])
  }
  const lastIndex = raiseVarStack.length - 1
  const raiseVarStackTail = raiseVarStack[lastIndex]
  
  // 检查类型
  body.forEach(({ type }) => {
    if (unSupportTypes.includes(type)) {
      // 抛错
      throw new Error(`不支持 esTree node: ${type}`)
    }
  })
  
  const resolvedModule: any[] = []
  // 需要前置的 var 声明变量
  const raiseVars: string[] = []
  
  // 逐行解析
  body
    .filter(({ type }) => !ignoreTypes.includes(type))
    .forEach(item => {
      const { type } = item
      const resolvedItem = parseStatementOrDeclaration(item, raiseVars)
      if (type === 'FunctionDeclaration') {
        // 函数声明需要前置
        resolvedModule.unshift(resolvedItem)
      } else {
        resolvedModule.push(resolvedItem)
      }
    })
  
  addRaiseVars(raiseVars, raiseVarStackTail)
  
  if (scopeBlock) { // 作用域块（这里专指函数的作用域）
    // var 声明上升
    resolvedModule.unshift({
      [getKeyName('type', compress)]: getTypeName('prefix-vars', compress),
      [getKeyName('value', compress)]: raiseVarStackTail
    })
    // 删除尾节点
    raiseVarStack.pop()
  }
  
  return resolvedModule
}

// 语句与声明解析
const parseStatementOrDeclaration = (row: any, raiseVars: string[] = []): any => {
  if (!row) return
  const { type } = row
  
  switch (type) {
    // 变量声明
    case 'VariableDeclaration':
      return parseVariableDeclaration(row, raiseVars)
    // 块作用域
    case 'BlockStatement':
      return parseBlockStatement(row)
    // 函数声明
    case 'FunctionDeclaration':
      return parseFunctionDeclaration(row)
    // 表达式语句
    case 'ExpressionStatement':
      return parseExpressionStatement(row)
    // 返回语句
    case 'ReturnStatement':
      return parseReturnStatement(row)
    // 抛错语句
    case 'ThrowStatement':
      return parseThrowStatement(row)
    // try 语句
    case 'TryStatement':
      return parseTryStatement(row)
    // catch 语句
    case 'CatchClause':
      return parseCatchClause(row)
    // if...else 语句
    case 'IfStatement':
      return parseIfStatement(row, raiseVars)
    case 'SwitchStatement':
      return parseSwitchStatement(row, raiseVars)
    case 'WhileStatement':
      return parseWhileStatement(row, raiseVars)
    case 'DoWhileStatement':
      return parseDoWhileStatement(row, raiseVars)
    case 'ForStatement':
      return parseForStatement(row, raiseVars)
    case 'ForInStatement':
      return parseForInStatement(row, raiseVars)
    case 'BreakStatement':
      return parseBreakStatement(row)
    case 'ContinueStatement':
      return parseContinuteStatement(row)
    case 'LabeledStatement':
      return parseLabeledStatement(row)
    default:
      // 非不处理类型，需要报错
      if (!ignoreTypes.includes(type)) throw new Error(`意料之外的 esTree node: ${type}`)
  }
}

/**
 * 表达式(expression)
 * 字面量(Literal) 在 AST 中也属于 expression
 */
const parseExpression = (expression: any): any => {
  // 空值
  if (!expression) return
  
  switch (expression.type) {
    case 'Literal':
      if (expression.regex) {
        return parseRegExpLiteral(expression.regex)
      }
    // 数字字面量
    case 'NumericLiteral':
    // 字符串字面量
    case 'StringLiteral':
    // 布尔值字面量
    case 'BooleanLiteral':
      return {
        [getKeyName('type', compress)]: getTypeName('literal', compress),
        [getKeyName('value', compress)]: expression.value
      }
    // null 类型
    case 'NullLiteral':
      return {
        [getKeyName('type', compress)]: getTypeName('literal', compress),
        [getKeyName('value', compress)]: null
      }
    // Identifier
    case 'Identifier':
      return {
        [getKeyName('type', compress)]: getTypeName('call-function', compress),
        [getKeyName('name', compress)]: getCallFunName('getConst', compress),
        [getKeyName('value', compress)]: expression.name
      }
    // 函数表达式
    case 'FunctionExpression':
      return parseFunctionExpression(expression)
    // 正则表达式
    case 'RegExpLiteral':
      return parseRegExpLiteral(expression)
    // new Class
    case 'NewExpression':
      return parseNewExpression(expression)
    // 赋值语句
    case 'AssignmentExpression':
      return parseAssignmentExpression(expression)
    // MemberExpression
    case 'MemberExpression':
      return parseMemberExpression(expression)
    // this 指针
    case 'ThisExpression':
      return {
        [getKeyName('type', compress)]: getTypeName('this', compress)
      }
    // 一元运算
    case 'UnaryExpression':
      return parseUnaryExpression(expression)
    // 二元运算
    case 'BinaryExpression':
      return parseBinaryExpression(expression)
    // 三元运算
    case 'ConditionalExpression':
      return parseConditionalExpression(expression)
    // 方法调用
    case 'CallExpression':
      return parseCallExpression(expression)
    // 自更新表达式
    case 'UpdateExpression':
      return parseUpdateExpression(expression)
    // 数组表达式
    case 'ArrayExpression':
      return parseArrayExpression(expression)
    // 逗号分隔的表达式
    case 'SequenceExpression':
      return parseSequenceExpression(expression)
    // 对象表达式
    case 'ObjectExpression':
      return parseObjectExpression(expression)
    // 逻辑表达式
    case 'LogicalExpression':
      return parseLogicalExpression(expression)
    default:
      throw new Error(`意料之外的 expression 类型：${expression.type}`)
  }
}

// 赋值声明
const parseVariableDeclaration = ({ kind, declarations }: any, raiseVars: string[] = []): any => {
  if (declarations.length > 0) {
    return {
      [getKeyName('type', compress)]: getTypeName('call-function', compress),
      [getKeyName('name', compress)]: getCallFunName('batchDeclaration', compress),
      [getKeyName('value', compress)]: [
        kind,
        declarations.map(({ id, init }: any) => {
          if (kind === 'var') {
            raiseVars.push(id.name)
          }
          const item: any = { [getKeyName('key', compress)]: id.name }
          if (init) {
            Object.assign(
              item,
              { [getKeyName('value', compress)]: parseExpression(init) }
            )
          }
          return item
        })
      ]
    }
  }
}

// new 语句
const parseNewExpression = ({ callee, arguments: args }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('newClass', compress),
    [getKeyName('value', compress)]: [
      parseExpression(callee),
      args.map((item: any) => parseExpression(item))
    ]
  }
}

// 调用函数
const parseCallExpression = ({ callee, arguments: args }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callFun', compress),
    [getKeyName('value', compress)]: [
      parseExpression(callee),
      args.map((item: any) => parseExpression(item))
    ]
  }
}

// 函数语句
const parseFunctionExpression = ({ id, params, body: { body } }: any, isDeclaration?: boolean): any => {
  const name = id && id.name
  if (isDeclaration && name && ignoreFNames.includes(id.name)) {
    // @babel/runtime/helpers
    return {
      [getKeyName('type', compress)]: getTypeName('call-function', compress),
      [getKeyName('name', compress)]: getCallFunName('getConst', compress),
      [getKeyName('value', compress)]: name
    }
  }
  return {
    [getKeyName('type', compress)]: (
      isDeclaration ?
        getTypeName('declare-function', compress) :
        getTypeName('customize-function', compress)
    ),
    [getKeyName('name', compress)]: name,
    [getKeyName('params', compress)]: params.map(({ name }: any) => name),
    [getKeyName('body', compress)]: es5ToDsl(body, true)
  }
}

// 函数声明
const parseFunctionDeclaration = (declaration: any): any => {
  return parseFunctionExpression(declaration, true)
}

// 块级作用域
const parseBlockStatement = (statement: any, supportBreak = false, supportContinue = false): any => {
  if (!statement) return
  const { body = [] } = statement
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callBlockStatement', compress),
    [getKeyName('value', compress)]: [es5ToDsl(body), supportBreak, supportContinue]
  }
}

// 表达式语句
const parseExpressionStatement = ({ expression }: any): any => {
  return parseExpression(expression)
}

// 返回语句
const parseReturnStatement = ({ argument }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callReturn', compress),
    [getKeyName('value', compress)]: [parseExpression(argument)]
  }
}

// if...else 语句
const parseIfStatement = ({ test, consequent, alternate }: any, raiseVars: string[]): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callIfElse', compress),
    [getKeyName('value', compress)]: [
      parseExpression(test),
      parseStatementOrDeclaration(consequent, raiseVars),
      parseStatementOrDeclaration(alternate, raiseVars)
    ]
  }
}

// 对象成员赋值
const parseMemberExpression = (expression: any): any => {
  const {
    object,
    computed,
    property
  } = expression
  const memberValue: any[] = []
  if (object.type === 'Identifier') {
    memberValue.push(object.name)
  } else if (object.type === 'MemberExpression') {
    const member = parseMemberExpression(object)
    memberValue.push(...member[getKeyName('value', compress)])
  } else if (object.regex) {
    // acorn
    memberValue.push(parseRegExpLiteral(object.regex))
  } else if (object.type === 'RegExpLiteral') {
    // babel/parse
    memberValue.push(parseRegExpLiteral(object))
  } else {
    // 当一个普通表达式处理
    memberValue.push(parseExpression(object))
  }
  // 最后一个成员
  memberValue.push(computed ? parseExpression(property) : property.name)
  return {
    [getKeyName('type', compress)]: getTypeName('member', compress),
    [getKeyName('value', compress)]: memberValue,
  }
}

// 一元运算
const parseUnaryExpression = ({ operator, argument }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callUnary', compress),
    [getKeyName('value', compress)]: [operator, parseExpression(argument)]
  }
}

// 二元运算
const parseBinaryExpression = ({ left, operator, right }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callBinary', compress),
    [getKeyName('value', compress)]: [parseExpression(left), operator, parseExpression(right)]
  }
}

// 三元运算
const parseConditionalExpression = ({ test, consequent, alternate }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callConditional', compress),
    [getKeyName('value', compress)]: [
      parseExpression(test),
      parseExpression(consequent),
      parseExpression(alternate)
    ]
  }
}

// 正则表达式
const parseRegExpLiteral = ({ pattern, flags }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('getRegExp', compress),
    [getKeyName('value', compress)]: [pattern, flags]
  }
}

// 逻辑表达式
const parseLogicalExpression = ({ left, operator, right }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callLogical', compress),
    [getKeyName('value', compress)]: [
      parseExpression(left),
      operator,
      parseExpression(right)
    ]
  }
}

// 赋值运算
const parseAssignmentExpression = ({ left, right, operator }: any): any => {
  if (left.type === 'Identifier') {
    // 变量赋值
    return {
      [getKeyName('type', compress)]: getTypeName('call-function', compress),
      [getKeyName('name', compress)]: getCallFunName('assignLet', compress),
      [getKeyName('value', compress)]: [left.name, parseExpression(right), operator]
    }
  } else if (left.type === 'MemberExpression') {
    // 对象成员
    return {
      [getKeyName('type', compress)]: getTypeName('call-function', compress),
      [getKeyName('name', compress)]: getCallFunName('assignLet', compress),
      [getKeyName('value', compress)]: [parseMemberExpression(left), parseExpression(right), operator]
    }
  }
  throw new Error(`Uncaught SyntaxError: Invalid left-hand side in assignment`)
}

// 自更新运算
const parseUpdateExpression = ({ operator, argument, prefix }: any): any => {
  if (argument.type === 'Identifier') {
    return {
      [getKeyName('type', compress)]: getTypeName('call-function', compress),
      [getKeyName('name', compress)]: getCallFunName('callUpdate', compress),
      [getKeyName('value', compress)]: [operator, argument.name, prefix]
    }
  } else if (argument.type === 'MemberExpression') {
    return {
      [getKeyName('type', compress)]: getTypeName('call-function', compress),
      [getKeyName('name', compress)]: getCallFunName('callUpdate', compress),
      [getKeyName('value', compress)]: [operator, parseExpression(argument), prefix]
    }
  }
  throw new Error(`Uncaught SyntaxError: Invalid left-hand side expression in ${prefix ? 'prefix' : 'postfix'} operation`)
}

// 数组表达式
const parseArrayExpression = ({ elements }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('array-literal', compress),
    [getKeyName('value', compress)]: elements.map((item: any) => parseExpression(item))
  }
}

// 抛错语句
const parseThrowStatement = ({ argument }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callThrow', compress),
    [getKeyName('value', compress)]: parseExpression(argument)
  }
}

// try 语句
const parseTryStatement = ({ block, handler, finalizer }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callTryCatch', compress),
    [getKeyName('value', compress)]: [
      parseBlockStatement(block),
      parseStatementOrDeclaration(handler),
      finalizer && parseBlockStatement(finalizer)
    ]
  }
}

// catch 语句
const parseCatchClause = ({ param, body }: any): any => {
  return parseFunctionExpression({ params: [param], body })
}

// switch 语句
const parseSwitchStatement = ({ discriminant, cases }: any, raiseVars: string[]): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callSwitch', compress),
    [getKeyName('value', compress)]: [
      parseExpression(discriminant),
      cases.map(({ test, consequent }: any) => [
        parseExpression(test),
        consequent.map((item: any) => parseStatementOrDeclaration(item, raiseVars))
      ])
    ]
  }
}

// 序列语句
const parseSequenceExpression = ({ expressions }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callSequence', compress),
    [getKeyName('value', compress)]: [expressions.map((expression: any) => parseExpression(expression))]
  }
}

// 对象表达式
const parseObjectExpression = ({ properties }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('object-literal', compress),
    [getKeyName('value', compress)]: properties.map(({ key, value }: any) => ({
      [getKeyName('key', compress)]: key.type === 'Identifier' ? key.name : key.value,
      [getKeyName('value', compress)]: (
        value && value.type === 'MemberExpression'
          ? {
            [getKeyName('type', compress)]: getTypeName('call-function', compress),
            [getKeyName('name', compress)]: getCallFunName('getValue', compress),
            [getKeyName('value', compress)]: [parseExpression(value)]
          }
          : parseExpression(value)
      )
    }))
  }
}

// while 语句
const parseWhileStatement = ({ test, body }: any, raiseVars: string[]): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callWhile', compress),
    [getKeyName('value', compress)]: [
      parseExpression(test),
      parseStatementOrDeclaration(body, raiseVars)
    ]
  }
}

// DoWhileStatement 语句
const parseDoWhileStatement = ({ test, body }: any, raiseVars: string[]): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callDoWhile', compress),
    [getKeyName('value', compress)]: [
      parseExpression(test),
      parseStatementOrDeclaration(body, raiseVars)
    ]
  }
}

// for 语句
const parseForStatement = ({ init, test, body, update }: any, raiseVars: string[]): any => {
  // for 语句与 for...in 不同，没有隐藏的作用域
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callFor', compress),
    [getKeyName('value', compress)]: [
      (
        init && init.type === 'VariableDeclaration'
          ? parseVariableDeclaration(init, raiseVars)
          : parseExpression(init)
      ),
      parseExpression(test),
      parseExpression(update),
      parseStatementOrDeclaration(body)
    ]
  }
}

// for...in 语句
const parseForInStatement = ({ left, right, body }: any, raiseVars: string[]): any => {
  let leftDsl: any
  switch (left.type) {
    case 'Identifier':
      leftDsl = [left.name]
      break
    case 'MemberExpression':
      leftDsl = parseMemberExpression(left)
      break
    case 'VariableDeclaration':
      leftDsl = parseVariableDeclaration(left, raiseVars)
      break
    default:
      throw new Error(`未知的 for...in 初始化类型：${left.type}`)
  }
  // for...in 语句有一个隐藏的作用域，用 blockStatement 来代替
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callBlockStatement', compress),
    [getKeyName('value', compress)]: [
      [
        {
          [getKeyName('type', compress)]: getTypeName('call-function', compress),
          [getKeyName('name', compress)]: getCallFunName('callForIn', compress),
          [getKeyName('value', compress)]: [
            leftDsl,
            parseExpression(right),
            parseStatementOrDeclaration(body, raiseVars)
          ]
        }
      ]
    ]
  }
}

// break 语句
const parseBreakStatement = ({ label }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callBreak', compress),
    [getKeyName('value', compress)]: label ? label.name : undefined
  }
}

// continue 语句
const parseContinuteStatement = ({ label }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('call-function', compress),
    [getKeyName('name', compress)]: getCallFunName('callContinue', compress),
    [getKeyName('value', compress)]: label ? label.name : undefined
  }
}

// 标记语句
const parseLabeledStatement = ({ label, body }: any): any => {
  return {
    [getKeyName('type', compress)]: getTypeName('label-statement', compress),
    [getKeyName('value', compress)]: [
      {
        [getKeyName('type', compress)]: getTypeName('call-function', compress),
        [getKeyName('name', compress)]: getCallFunName('addLabel', compress),
        [getKeyName('value', compress)]: label.name
      },
      parseStatementOrDeclaration(body),
      {
        [getKeyName('type', compress)]: getTypeName('call-function', compress),
        [getKeyName('name', compress)]: getCallFunName('removeLabel', compress)
      }
    ]
  }
}

export const dslParse = (es5Tree: any, isCompress = false, currentIgnoreFNames: string[] = []): any => {
  compress = isCompress
  ignoreFNames = currentIgnoreFNames
  // es5源码体
  const { body } = es5Tree.type === 'File' ? es5Tree.program : es5Tree
  // 解析主体
  return es5ToDsl(body, true)
}