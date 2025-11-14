// src/index.ts
import { WebSocketServer } from "ws";
import { parse } from "@babel/parser";

// src/utils.ts
var resolveFunKeysMap = {
  "getValue": "gV",
  "let": "l",
  "var": "v",
  "batchLet": "bL",
  "batchVar": "bV",
  "batchDeclaration": "bD",
  "getConst": "gC",
  "getLet": "gL",
  "getVar": "gVar",
  "getFunction": "gF",
  "getArg": "gA",
  "getObjMember": "gOM",
  "getOrAssignOrDissocPath": "gADP",
  "assignLet": "aL",
  "getResultByOperator": "gRBO",
  "setLet": "sL",
  "callReturn": "cR",
  "callBreak": "cBr",
  "callContinue": "cCo",
  "callUnary": "cU",
  "callBinary": "cB",
  "callUpdate": "cUp",
  "callLogical": "cL",
  "callThrow": "cT",
  "callWhile": "cW",
  "callDoWhile": "cDW",
  "callFor": "cF",
  "callForIn": "cFI",
  "callForOf": "cFO",
  "destroy": "d",
  "delete": "del",
  "createFunction": "f",
  "callBlockStatement": "cBS",
  "callIfElse": "cIE",
  "callConditional": "cC",
  "getRegExp": "gRE",
  "newClass": "nC",
  "callFun": "c",
  "callTryCatch": "cTC",
  "callSwitch": "s",
  "callSequence": "cS",
  "addLabel": "aL",
  "removeLabel": "rL",
  "templateLiteral": "tL",
  "spreadElement": "sE",
  "classExtends": "cE",
  "destructureAssign": "dA",
  "getImportMeta": "gIM",
  "getMetaProperty": "gMP",
  "optionalMember": "oM",
  "optionalCall": "oC",
  "exportNamed": "eN",
  "exportDefault": "eD",
  "exportAll": "eA",
  "importDefault": "iD",
  "importNamespace": "iNS",
  "importNamed": "iN",
  "dynamicImport": "dI",
  "getImport": "gI",
  "awaitExpression": "aE"
};
var resolveTypeKeysMap = {
  "call-function": "c",
  "customize-function": "f",
  "declare-function": "d",
  component: "f",
  "array-literal": "a",
  "object-literal": "o",
  literal: "l",
  "prefix-vars": "p",
  "member": "m",
  "label-statement": "ls",
  "this": "t",
  "array-pattern": "ap",
  "object-pattern": "op",
  "identifier-pattern": "ip",
  "rest-pattern": "rp",
  "unknown-pattern": "up"
};
var dslObjKeyNamesMap = {
  type: "t",
  name: "n",
  value: "v",
  params: "p",
  body: "b",
  key: "k"
};
var getCallFunName = (name, compress2 = false) => {
  if (!compress2 || !resolveFunKeysMap[name]) return name;
  return resolveFunKeysMap[name];
};
var getTypeName = (name, compress2 = false) => {
  if (!compress2 || !resolveTypeKeysMap[name]) return name;
  return resolveTypeKeysMap[name];
};
var getKeyName = (name, compress2 = false) => {
  if (!compress2 || !dslObjKeyNamesMap[name]) return name;
  return dslObjKeyNamesMap[name];
};

// src/parser.ts
var ignoreTypes = [
  "DebuggerStatement",
  "Directive",
  "EmptyStatement"
];
var unSupportTypes = [
  "WithStatement",
  "Patterns"
];
var compress = false;
var ignoreFNames = [];
var raiseVarStack = [];
var addRaiseVars = (raiseVars, raiseVarStackTail) => {
  raiseVars.forEach((raiseVar) => {
    if (!raiseVarStackTail.includes(raiseVar)) {
      raiseVarStackTail.push(raiseVar);
    }
  });
};
var es5ToDsl = (body, scopeBlock = false) => {
  if (scopeBlock) {
    raiseVarStack.push([]);
  }
  const lastIndex = raiseVarStack.length - 1;
  const raiseVarStackTail = raiseVarStack[lastIndex];
  body.forEach(({ type }) => {
    if (unSupportTypes.includes(type)) {
      throw new Error(`\u4E0D\u652F\u6301 esTree node: ${type}`);
    }
  });
  const resolvedModule = [];
  const raiseVars = [];
  body.filter(({ type }) => !ignoreTypes.includes(type)).forEach((item) => {
    const { type } = item;
    const resolvedItem = parseStatementOrDeclaration(item, raiseVars);
    if (Array.isArray(resolvedItem)) {
      resolvedItem.forEach((subItem) => {
        if (type === "FunctionDeclaration" || type === "ClassDeclaration") {
          resolvedModule.unshift(subItem);
        } else if (type === "ImportDeclaration") {
          resolvedModule.unshift(subItem);
        } else {
          resolvedModule.push(subItem);
        }
      });
    } else if (resolvedItem) {
      if (type === "FunctionDeclaration" || type === "ClassDeclaration") {
        resolvedModule.unshift(resolvedItem);
      } else if (type === "ImportDeclaration") {
        resolvedModule.unshift(resolvedItem);
      } else {
        resolvedModule.push(resolvedItem);
      }
    }
  });
  addRaiseVars(raiseVars, raiseVarStackTail);
  if (scopeBlock) {
    resolvedModule.unshift({
      [getKeyName("type", compress)]: getTypeName("prefix-vars", compress),
      [getKeyName("value", compress)]: raiseVarStackTail
    });
    raiseVarStack.pop();
  }
  return resolvedModule;
};
var parseStatementOrDeclaration = (row, raiseVars = []) => {
  if (!row) return;
  const { type } = row;
  switch (type) {
    // 变量声明
    case "VariableDeclaration":
      return parseVariableDeclaration(row, raiseVars);
    // 块作用域
    case "BlockStatement":
      return parseBlockStatement(row);
    // 函数声明
    case "FunctionDeclaration":
      return parseFunctionDeclaration(row);
    // 表达式语句
    case "ExpressionStatement":
      return parseExpressionStatement(row);
    // 返回语句
    case "ReturnStatement":
      return parseReturnStatement(row);
    // 抛错语句
    case "ThrowStatement":
      return parseThrowStatement(row);
    // try 语句
    case "TryStatement":
      return parseTryStatement(row);
    // catch 语句
    case "CatchClause":
      return parseCatchClause(row);
    // if...else 语句
    case "IfStatement":
      return parseIfStatement(row, raiseVars);
    case "SwitchStatement":
      return parseSwitchStatement(row, raiseVars);
    case "WhileStatement":
      return parseWhileStatement(row, raiseVars);
    case "DoWhileStatement":
      return parseDoWhileStatement(row, raiseVars);
    case "ForStatement":
      return parseForStatement(row, raiseVars);
    case "ForInStatement":
      return parseForInStatement(row, raiseVars);
    case "ForOfStatement":
      return parseForOfStatement(row, raiseVars);
    case "BreakStatement":
      return parseBreakStatement(row);
    case "ContinueStatement":
      return parseContinuteStatement(row);
    case "LabeledStatement":
      return parseLabeledStatement(row);
    case "ClassDeclaration":
      return parseClassDeclaration(row);
    case "ExportNamedDeclaration":
      return parseExportNamedDeclaration(row, raiseVars);
    case "ExportDefaultDeclaration":
      return parseExportDefaultDeclaration(row, raiseVars);
    case "ExportAllDeclaration":
      return parseExportAllDeclaration(row);
    case "ImportDeclaration":
      return parseImportDeclaration(row);
    default:
      if (!ignoreTypes.includes(type)) throw new Error(`\u610F\u6599\u4E4B\u5916\u7684 esTree node: ${type}`);
  }
};
var parseExpression = (expression) => {
  if (!expression) return;
  switch (expression.type) {
    case "Literal":
      if (expression.regex) {
        return parseRegExpLiteral(expression.regex);
      }
    // 数字字面量
    case "NumericLiteral":
    // 字符串字面量
    case "StringLiteral":
    // 布尔值字面量
    case "BooleanLiteral":
      return {
        [getKeyName("type", compress)]: getTypeName("literal", compress),
        [getKeyName("value", compress)]: expression.value
      };
    // null 类型
    case "NullLiteral":
      return {
        [getKeyName("type", compress)]: getTypeName("literal", compress),
        [getKeyName("value", compress)]: null
      };
    // Identifier
    case "Identifier":
      return {
        [getKeyName("type", compress)]: getTypeName("call-function", compress),
        [getKeyName("name", compress)]: getCallFunName("getConst", compress),
        [getKeyName("value", compress)]: expression.name
      };
    // 函数表达式
    case "FunctionExpression":
      return parseFunctionExpression(expression);
    // 正则表达式
    case "RegExpLiteral":
      return parseRegExpLiteral(expression);
    // new Class
    case "NewExpression":
      return parseNewExpression(expression);
    // 赋值语句
    case "AssignmentExpression":
      return parseAssignmentExpression(expression);
    // MemberExpression
    case "MemberExpression":
      return parseMemberExpression(expression);
    // this 指针
    case "ThisExpression":
      return {
        [getKeyName("type", compress)]: getTypeName("this", compress)
      };
    // 一元运算
    case "UnaryExpression":
      return parseUnaryExpression(expression);
    // 二元运算
    case "BinaryExpression":
      return parseBinaryExpression(expression);
    // 三元运算
    case "ConditionalExpression":
      return parseConditionalExpression(expression);
    // 方法调用
    case "CallExpression":
      return parseCallExpression(expression);
    // 自更新表达式
    case "UpdateExpression":
      return parseUpdateExpression(expression);
    // 数组表达式
    case "ArrayExpression":
      return parseArrayExpression(expression);
    // 逗号分隔的表达式
    case "SequenceExpression":
      return parseSequenceExpression(expression);
    // 对象表达式
    case "ObjectExpression":
      return parseObjectExpression(expression);
    // 逻辑表达式
    case "LogicalExpression":
      return parseLogicalExpression(expression);
    // 模板字符串
    case "TemplateLiteral":
      return parseTemplateLiteral(expression);
    // 箭头函数
    case "ArrowFunctionExpression":
      return parseArrowFunctionExpression(expression);
    // 展开语法
    case "SpreadElement":
      return parseSpreadElement(expression);
    // 类表达式
    case "ClassExpression":
      return parseClassExpression(expression);
    // import.meta
    case "MetaProperty":
      return parseMetaProperty(expression);
    // 可选链
    case "OptionalMemberExpression":
      return parseOptionalMemberExpression(expression);
    // 可选调用
    case "OptionalCallExpression":
      return parseOptionalCallExpression(expression);
    // 动态导入
    case "Import":
      return parseDynamicImport(expression);
    // await 表达式
    case "AwaitExpression":
      return parseAwaitExpression(expression);
    default:
      throw new Error(`\u610F\u6599\u4E4B\u5916\u7684 expression \u7C7B\u578B\uFF1A${expression.type}`);
  }
};
var parseVariableDeclaration = ({ kind, declarations }, raiseVars = []) => {
  if (declarations.length > 0) {
    return {
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("batchDeclaration", compress),
      [getKeyName("value", compress)]: [
        kind,
        declarations.map(({ id, init }) => {
          if (kind === "var") {
            raiseVars.push(id.name);
          }
          const item = { [getKeyName("key", compress)]: id.name };
          if (init) {
            Object.assign(
              item,
              { [getKeyName("value", compress)]: parseExpression(init) }
            );
          }
          return item;
        })
      ]
    };
  }
};
var parseNewExpression = ({ callee, arguments: args }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("newClass", compress),
    [getKeyName("value", compress)]: [
      parseExpression(callee),
      args.map((item) => parseExpression(item))
    ]
  };
};
var parseCallExpression = ({ callee, arguments: args }) => {
  if (callee.type === "Import") {
    return {
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("dynamicImport", compress),
      [getKeyName("value", compress)]: args.map((item) => parseExpression(item))
    };
  }
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callFun", compress),
    [getKeyName("value", compress)]: [
      parseExpression(callee),
      args.map((item) => parseExpression(item))
    ]
  };
};
var parseFunctionExpression = ({ id, params, body: { body } }, isDeclaration) => {
  const name = id && id.name;
  if (isDeclaration && name && ignoreFNames.includes(id.name)) {
    return {
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("getConst", compress),
      [getKeyName("value", compress)]: name
    };
  }
  return {
    [getKeyName("type", compress)]: isDeclaration ? getTypeName("declare-function", compress) : getTypeName("customize-function", compress),
    [getKeyName("name", compress)]: name,
    [getKeyName("params", compress)]: params.map((param) => {
      if (!param) return null;
      if (param.type === "Identifier") return param.name;
      if (param.type === "RestElement") return `...${param.argument.name}`;
      return `param_${param.type}`;
    }).filter(Boolean),
    [getKeyName("body", compress)]: es5ToDsl(body, true)
  };
};
var parseFunctionDeclaration = (declaration) => {
  return parseFunctionExpression(declaration, true);
};
var parseBlockStatement = (statement, supportBreak = false, supportContinue = false) => {
  if (!statement) return;
  const { body = [] } = statement;
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callBlockStatement", compress),
    [getKeyName("value", compress)]: [es5ToDsl(body), supportBreak, supportContinue]
  };
};
var parseExpressionStatement = ({ expression }) => {
  return parseExpression(expression);
};
var parseReturnStatement = ({ argument }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callReturn", compress),
    [getKeyName("value", compress)]: [parseExpression(argument)]
  };
};
var parseIfStatement = ({ test, consequent, alternate }, raiseVars) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callIfElse", compress),
    [getKeyName("value", compress)]: [
      parseExpression(test),
      parseStatementOrDeclaration(consequent, raiseVars),
      parseStatementOrDeclaration(alternate, raiseVars)
    ]
  };
};
var parseMemberExpression = (expression) => {
  const {
    object,
    computed,
    property
  } = expression;
  const memberValue = [];
  if (object.type === "Identifier") {
    memberValue.push(object.name);
  } else if (object.type === "MemberExpression") {
    const member = parseMemberExpression(object);
    memberValue.push(...member[getKeyName("value", compress)]);
  } else if (object.regex) {
    memberValue.push(parseRegExpLiteral(object.regex));
  } else if (object.type === "RegExpLiteral") {
    memberValue.push(parseRegExpLiteral(object));
  } else {
    memberValue.push(parseExpression(object));
  }
  memberValue.push(computed ? parseExpression(property) : property.name);
  return {
    [getKeyName("type", compress)]: getTypeName("member", compress),
    [getKeyName("value", compress)]: memberValue
  };
};
var parseUnaryExpression = ({ operator, argument }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callUnary", compress),
    [getKeyName("value", compress)]: [operator, parseExpression(argument)]
  };
};
var parseBinaryExpression = ({ left, operator, right }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callBinary", compress),
    [getKeyName("value", compress)]: [parseExpression(left), operator, parseExpression(right)]
  };
};
var parseConditionalExpression = ({ test, consequent, alternate }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callConditional", compress),
    [getKeyName("value", compress)]: [
      parseExpression(test),
      parseExpression(consequent),
      parseExpression(alternate)
    ]
  };
};
var parseRegExpLiteral = ({ pattern, flags }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("getRegExp", compress),
    [getKeyName("value", compress)]: [pattern, flags]
  };
};
var parseLogicalExpression = ({ left, operator, right }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callLogical", compress),
    [getKeyName("value", compress)]: [
      parseExpression(left),
      operator,
      parseExpression(right)
    ]
  };
};
var parseAssignmentExpression = ({ left, right, operator }) => {
  if (left.type === "Identifier") {
    return {
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("assignLet", compress),
      [getKeyName("value", compress)]: [left.name, parseExpression(right), operator]
    };
  } else if (left.type === "MemberExpression") {
    return {
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("assignLet", compress),
      [getKeyName("value", compress)]: [parseMemberExpression(left), parseExpression(right), operator]
    };
  } else if (left.type === "ArrayPattern" || left.type === "ObjectPattern") {
    return {
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("destructureAssign", compress),
      [getKeyName("value", compress)]: [parsePattern(left), parseExpression(right), operator]
    };
  }
  try {
    return {
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("assignLet", compress),
      [getKeyName("value", compress)]: [parseExpression(left), parseExpression(right), operator]
    };
  } catch (e) {
    throw new Error(`Uncaught SyntaxError: Invalid left-hand side in assignment`);
  }
};
var parseUpdateExpression = ({ operator, argument, prefix }) => {
  if (argument.type === "Identifier") {
    return {
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("callUpdate", compress),
      [getKeyName("value", compress)]: [operator, argument.name, prefix]
    };
  } else if (argument.type === "MemberExpression") {
    return {
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("callUpdate", compress),
      [getKeyName("value", compress)]: [operator, parseExpression(argument), prefix]
    };
  }
  throw new Error(`Uncaught SyntaxError: Invalid left-hand side expression in ${prefix ? "prefix" : "postfix"} operation`);
};
var parseArrayExpression = ({ elements }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("array-literal", compress),
    [getKeyName("value", compress)]: elements.map((item) => parseExpression(item))
  };
};
var parseThrowStatement = ({ argument }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callThrow", compress),
    [getKeyName("value", compress)]: parseExpression(argument)
  };
};
var parseTryStatement = ({ block, handler, finalizer }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callTryCatch", compress),
    [getKeyName("value", compress)]: [
      parseBlockStatement(block),
      parseStatementOrDeclaration(handler),
      finalizer && parseBlockStatement(finalizer)
    ]
  };
};
var parseCatchClause = ({ param, body }) => {
  return parseFunctionExpression({ params: [param], body });
};
var parseSwitchStatement = ({ discriminant, cases }, raiseVars) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callSwitch", compress),
    [getKeyName("value", compress)]: [
      parseExpression(discriminant),
      cases.map(({ test, consequent }) => [
        parseExpression(test),
        consequent.map((item) => parseStatementOrDeclaration(item, raiseVars))
      ])
    ]
  };
};
var parseSequenceExpression = ({ expressions }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callSequence", compress),
    [getKeyName("value", compress)]: [expressions.map((expression) => parseExpression(expression))]
  };
};
var parseObjectExpression = ({ properties }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("object-literal", compress),
    [getKeyName("value", compress)]: properties.map((prop) => {
      if (!prop || !prop.key) {
        return {
          [getKeyName("key", compress)]: "unknown",
          [getKeyName("value", compress)]: null
        };
      }
      const { key, value } = prop;
      return {
        [getKeyName("key", compress)]: key.type === "Identifier" ? key.name : key.value,
        [getKeyName("value", compress)]: value && value.type === "MemberExpression" ? {
          [getKeyName("type", compress)]: getTypeName("call-function", compress),
          [getKeyName("name", compress)]: getCallFunName("getValue", compress),
          [getKeyName("value", compress)]: [parseExpression(value)]
        } : parseExpression(value)
      };
    })
  };
};
var parseWhileStatement = ({ test, body }, raiseVars) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callWhile", compress),
    [getKeyName("value", compress)]: [
      parseExpression(test),
      parseStatementOrDeclaration(body, raiseVars)
    ]
  };
};
var parseDoWhileStatement = ({ test, body }, raiseVars) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callDoWhile", compress),
    [getKeyName("value", compress)]: [
      parseExpression(test),
      parseStatementOrDeclaration(body, raiseVars)
    ]
  };
};
var parseForStatement = ({ init, test, body, update }, raiseVars) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callFor", compress),
    [getKeyName("value", compress)]: [
      init && init.type === "VariableDeclaration" ? parseVariableDeclaration(init, raiseVars) : parseExpression(init),
      parseExpression(test),
      parseExpression(update),
      parseStatementOrDeclaration(body)
    ]
  };
};
var parseForInStatement = ({ left, right, body }, raiseVars) => {
  let leftDsl;
  switch (left.type) {
    case "Identifier":
      leftDsl = [left.name];
      break;
    case "MemberExpression":
      leftDsl = parseMemberExpression(left);
      break;
    case "VariableDeclaration":
      leftDsl = parseVariableDeclaration(left, raiseVars);
      break;
    default:
      throw new Error(`\u672A\u77E5\u7684 for...in \u521D\u59CB\u5316\u7C7B\u578B\uFF1A${left.type}`);
  }
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callBlockStatement", compress),
    [getKeyName("value", compress)]: [
      [
        {
          [getKeyName("type", compress)]: getTypeName("call-function", compress),
          [getKeyName("name", compress)]: getCallFunName("callForIn", compress),
          [getKeyName("value", compress)]: [
            leftDsl,
            parseExpression(right),
            parseStatementOrDeclaration(body, raiseVars)
          ]
        }
      ]
    ]
  };
};
var parseForOfStatement = ({ left, right, body }, raiseVars) => {
  let leftDsl;
  switch (left.type) {
    case "Identifier":
      leftDsl = [left.name];
      break;
    case "MemberExpression":
      leftDsl = parseMemberExpression(left);
      break;
    case "VariableDeclaration":
      leftDsl = parseVariableDeclaration(left, raiseVars);
      break;
    default:
      throw new Error(`\u672A\u77E5\u7684 for...of \u521D\u59CB\u5316\u7C7B\u578B\uFF1A${left.type}`);
  }
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callBlockStatement", compress),
    [getKeyName("value", compress)]: [
      [
        {
          [getKeyName("type", compress)]: getTypeName("call-function", compress),
          [getKeyName("name", compress)]: getCallFunName("callForOf", compress),
          [getKeyName("value", compress)]: [
            leftDsl,
            parseExpression(right),
            parseStatementOrDeclaration(body, raiseVars)
          ]
        }
      ]
    ]
  };
};
var parseBreakStatement = ({ label }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callBreak", compress),
    [getKeyName("value", compress)]: label ? label.name : void 0
  };
};
var parseContinuteStatement = ({ label }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callContinue", compress),
    [getKeyName("value", compress)]: label ? label.name : void 0
  };
};
var parseLabeledStatement = ({ label, body }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("label-statement", compress),
    [getKeyName("value", compress)]: [
      {
        [getKeyName("type", compress)]: getTypeName("call-function", compress),
        [getKeyName("name", compress)]: getCallFunName("addLabel", compress),
        [getKeyName("value", compress)]: label.name
      },
      parseStatementOrDeclaration(body),
      {
        [getKeyName("type", compress)]: getTypeName("call-function", compress),
        [getKeyName("name", compress)]: getCallFunName("removeLabel", compress)
      }
    ]
  };
};
var parseSpreadElement = ({ argument }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("spreadElement", compress),
    [getKeyName("value", compress)]: parseExpression(argument)
  };
};
var parseArrowFunctionExpression = ({ params, body, async }) => {
  const functionBody = body.type === "BlockStatement" ? es5ToDsl(body.body, true) : [
    {
      [getKeyName("type", compress)]: getTypeName("prefix-vars", compress),
      [getKeyName("value", compress)]: []
    },
    {
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("callReturn", compress),
      [getKeyName("value", compress)]: [parseExpression(body)]
    }
  ];
  return {
    [getKeyName("type", compress)]: getTypeName("customize-function", compress),
    [getKeyName("name", compress)]: null,
    [getKeyName("params", compress)]: params.map((param) => {
      if (!param) return null;
      if (param.type === "Identifier") return param.name;
      if (param.type === "RestElement") return `...${param.argument.name}`;
      return `param_${param.type}`;
    }).filter(Boolean),
    [getKeyName("body", compress)]: functionBody,
    [getKeyName("async", compress)]: async || false
  };
};
var parseTemplateLiteral = ({ quasis, expressions }) => {
  if (quasis.length === 1 && expressions.length === 0) {
    return {
      [getKeyName("type", compress)]: getTypeName("literal", compress),
      [getKeyName("value", compress)]: quasis[0].value.cooked
    };
  }
  const parts = [];
  for (let i = 0; i < quasis.length; i++) {
    if (quasis[i].value.cooked !== "") {
      parts.push({
        [getKeyName("type", compress)]: getTypeName("literal", compress),
        [getKeyName("value", compress)]: quasis[i].value.cooked
      });
    }
    if (i < expressions.length) {
      parts.push(parseExpression(expressions[i]));
    }
  }
  if (parts.length === 1) {
    return parts[0];
  }
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("templateLiteral", compress),
    [getKeyName("value", compress)]: parts
  };
};
var parseDynamicImport = (expression) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("getImport", compress),
    [getKeyName("value", compress)]: []
  };
};
var parseAwaitExpression = ({ argument }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("awaitExpression", compress),
    [getKeyName("value", compress)]: parseExpression(argument)
  };
};
var parseMetaProperty = ({ meta, property }) => {
  if (meta.name === "import" && property.name === "meta") {
    return {
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("getImportMeta", compress),
      [getKeyName("value", compress)]: []
    };
  }
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("getMetaProperty", compress),
    [getKeyName("value", compress)]: [meta.name, property.name]
  };
};
var parseOptionalMemberExpression = ({ object, property, computed, optional }) => {
  const memberValue = [];
  if (object.type === "Identifier") {
    memberValue.push(object.name);
  } else {
    memberValue.push(parseExpression(object));
  }
  memberValue.push(computed ? parseExpression(property) : property.name);
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("optionalMember", compress),
    [getKeyName("value", compress)]: [
      {
        [getKeyName("type", compress)]: getTypeName("member", compress),
        [getKeyName("value", compress)]: memberValue
      },
      optional
    ]
  };
};
var parseOptionalCallExpression = ({ callee, arguments: args, optional }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("optionalCall", compress),
    [getKeyName("value", compress)]: [
      parseExpression(callee),
      args.map((item) => parseExpression(item)),
      optional
    ]
  };
};
var parsePattern = (pattern) => {
  switch (pattern.type) {
    case "ArrayPattern":
      return {
        [getKeyName("type", compress)]: getTypeName("array-pattern", compress),
        [getKeyName("value", compress)]: pattern.elements.map(
          (element) => element ? parsePattern(element) : null
        )
      };
    case "ObjectPattern":
      return {
        [getKeyName("type", compress)]: getTypeName("object-pattern", compress),
        [getKeyName("value", compress)]: pattern.properties.map((prop) => ({
          [getKeyName("key", compress)]: prop.key.name,
          [getKeyName("value", compress)]: parsePattern(prop.value)
        }))
      };
    case "Identifier":
      return {
        [getKeyName("type", compress)]: getTypeName("identifier-pattern", compress),
        [getKeyName("value", compress)]: pattern.name
      };
    case "RestElement":
      return {
        [getKeyName("type", compress)]: getTypeName("rest-pattern", compress),
        [getKeyName("value", compress)]: parsePattern(pattern.argument)
      };
    default:
      return {
        [getKeyName("type", compress)]: getTypeName("unknown-pattern", compress),
        [getKeyName("value", compress)]: pattern.type
      };
  }
};
var parseClassExpression = ({ id, superClass, body }) => {
  const className = id ? id.name : `AnonymousClass_${Date.now()}`;
  const classDeclaration = parseClassDeclaration({ id: { name: className }, superClass, body });
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("callFun", compress),
    [getKeyName("value", compress)]: [
      {
        [getKeyName("type", compress)]: getTypeName("customize-function", compress),
        [getKeyName("name", compress)]: null,
        [getKeyName("params", compress)]: [],
        [getKeyName("body", compress)]: [
          {
            [getKeyName("type", compress)]: getTypeName("prefix-vars", compress),
            [getKeyName("value", compress)]: []
          },
          ...Array.isArray(classDeclaration) ? classDeclaration : [classDeclaration],
          {
            [getKeyName("type", compress)]: getTypeName("call-function", compress),
            [getKeyName("name", compress)]: getCallFunName("callReturn", compress),
            [getKeyName("value", compress)]: [{
              [getKeyName("type", compress)]: getTypeName("call-function", compress),
              [getKeyName("name", compress)]: getCallFunName("getConst", compress),
              [getKeyName("value", compress)]: className
            }]
          }
        ]
      },
      []
    ]
  };
};
var parseClassDeclaration = ({ id, superClass, body }) => {
  const className = id ? id.name : null;
  const methods = [];
  body.body.forEach((method) => {
    if (method.type === "MethodDefinition") {
      const methodName = method.key.name;
      const isConstructor = method.kind === "constructor";
      const isStatic = method.static;
      if (isConstructor) {
        methods.unshift({
          [getKeyName("type", compress)]: getTypeName("declare-function", compress),
          [getKeyName("name", compress)]: className,
          [getKeyName("params", compress)]: method.value.params.map((param) => {
            if (!param) return null;
            if (param.type === "Identifier") return param.name;
            if (param.type === "RestElement") return `...${param.argument.name}`;
            return `param_${param.type}`;
          }).filter(Boolean),
          [getKeyName("body", compress)]: es5ToDsl(method.value.body.body, true)
        });
      } else {
        const target = isStatic ? [className, methodName] : [className, "prototype", methodName];
        methods.push({
          [getKeyName("type", compress)]: getTypeName("call-function", compress),
          [getKeyName("name", compress)]: getCallFunName("assignLet", compress),
          [getKeyName("value", compress)]: [
            {
              [getKeyName("type", compress)]: getTypeName("member", compress),
              [getKeyName("value", compress)]: target
            },
            {
              [getKeyName("type", compress)]: getTypeName("customize-function", compress),
              [getKeyName("name", compress)]: null,
              [getKeyName("params", compress)]: method.value.params.map((param) => {
                if (!param) return null;
                if (param.type === "Identifier") return param.name;
                if (param.type === "RestElement") return `...${param.argument.name}`;
                return `param_${param.type}`;
              }).filter(Boolean),
              [getKeyName("body", compress)]: es5ToDsl(method.value.body.body, true)
            },
            "="
          ]
        });
      }
    }
  });
  if (superClass) {
    methods.push({
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("classExtends", compress),
      [getKeyName("value", compress)]: [className, parseExpression(superClass)]
    });
  }
  return methods.length === 1 ? methods[0] : methods;
};
var parseExportNamedDeclaration = ({ declaration, specifiers, source }, raiseVars) => {
  const exports = [];
  if (declaration) {
    const declarationResult = parseStatementOrDeclaration(declaration, raiseVars);
    if (declarationResult) {
      exports.push(declarationResult);
    }
    if (declaration.type === "VariableDeclaration") {
      declaration.declarations.forEach((decl) => {
        exports.push({
          [getKeyName("type", compress)]: getTypeName("call-function", compress),
          [getKeyName("name", compress)]: getCallFunName("exportNamed", compress),
          [getKeyName("value", compress)]: [decl.id.name, decl.id.name]
        });
      });
    } else if (declaration.id) {
      exports.push({
        [getKeyName("type", compress)]: getTypeName("call-function", compress),
        [getKeyName("name", compress)]: getCallFunName("exportNamed", compress),
        [getKeyName("value", compress)]: [declaration.id.name, declaration.id.name]
      });
    }
  } else if (specifiers.length > 0) {
    specifiers.forEach((spec) => {
      exports.push({
        [getKeyName("type", compress)]: getTypeName("call-function", compress),
        [getKeyName("name", compress)]: getCallFunName("exportNamed", compress),
        [getKeyName("value", compress)]: [
          spec.local.name,
          spec.exported.name,
          source ? source.value : null
        ]
      });
    });
  }
  return exports.length === 1 ? exports[0] : exports;
};
var parseExportDefaultDeclaration = ({ declaration }, raiseVars) => {
  const exports = [];
  if (declaration.type === "Identifier") {
    exports.push({
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("exportDefault", compress),
      [getKeyName("value", compress)]: [{
        [getKeyName("type", compress)]: getTypeName("call-function", compress),
        [getKeyName("name", compress)]: getCallFunName("getConst", compress),
        [getKeyName("value", compress)]: declaration.name
      }]
    });
  } else {
    const declarationResult = parseStatementOrDeclaration(declaration, raiseVars) || parseExpression(declaration);
    if (declarationResult) {
      exports.push(declarationResult);
    }
    exports.push({
      [getKeyName("type", compress)]: getTypeName("call-function", compress),
      [getKeyName("name", compress)]: getCallFunName("exportDefault", compress),
      [getKeyName("value", compress)]: [declarationResult]
    });
  }
  return exports.length === 1 ? exports[0] : exports;
};
var parseExportAllDeclaration = ({ source }) => {
  return {
    [getKeyName("type", compress)]: getTypeName("call-function", compress),
    [getKeyName("name", compress)]: getCallFunName("exportAll", compress),
    [getKeyName("value", compress)]: [source.value]
  };
};
var parseImportDeclaration = ({ specifiers, source }) => {
  const imports = [];
  specifiers.forEach((spec) => {
    switch (spec.type) {
      case "ImportDefaultSpecifier":
        imports.push({
          [getKeyName("type", compress)]: getTypeName("call-function", compress),
          [getKeyName("name", compress)]: getCallFunName("importDefault", compress),
          [getKeyName("value", compress)]: [spec.local.name, source.value]
        });
        break;
      case "ImportNamespaceSpecifier":
        imports.push({
          [getKeyName("type", compress)]: getTypeName("call-function", compress),
          [getKeyName("name", compress)]: getCallFunName("importNamespace", compress),
          [getKeyName("value", compress)]: [spec.local.name, source.value]
        });
        break;
      case "ImportSpecifier":
        imports.push({
          [getKeyName("type", compress)]: getTypeName("call-function", compress),
          [getKeyName("name", compress)]: getCallFunName("importNamed", compress),
          [getKeyName("value", compress)]: [
            spec.local.name,
            spec.imported.name,
            source.value
          ]
        });
        break;
    }
  });
  return imports.length === 1 ? imports[0] : imports;
};
var dslParse = (es5Tree, isCompress = false, currentIgnoreFNames = []) => {
  compress = isCompress;
  ignoreFNames = currentIgnoreFNames;
  const { body } = es5Tree.type === "File" ? es5Tree.program : es5Tree;
  return es5ToDsl(body, true);
};

// src/index.ts
var defaultWatchOptions = {
  port: 9900,
  host: "localhost",
  protocol: "ws"
};
function kbsDslParser(options = {}) {
  const {
    compress: compress2 = false,
    ignoreFNames: ignoreFNames2 = [],
    watch = false,
    watchOptions,
    test = () => true,
    injectHtmlAttribute = true
  } = options;
  const wsOptions = { ...defaultWatchOptions, ...watchOptions };
  let websocketServer = null;
  let send = () => {
  };
  const dslStrMap = {};
  return {
    name: "kbs-dsl-parser",
    configResolved() {
      if (watch) {
        websocketServer = new WebSocketServer({ port: wsOptions.port });
        console.log("WebSocket \u670D\u52A1\u521B\u5EFA\u6210\u529F!");
        websocketServer.on("connection", (ws) => {
          console.log("WebSocket \u8FDE\u63A5\u6210\u529F");
          send = (data) => {
            ws.send(data);
          };
          ws.on("close", () => {
            console.log("WebSocket \u65AD\u5F00");
            send = () => {
            };
          });
        });
      }
    },
    generateBundle(_, bundle) {
      const jsFileToDslMap = /* @__PURE__ */ new Map();
      Object.entries(bundle).forEach(([fileName, chunk]) => {
        if (chunk.type !== "chunk" || !fileName.endsWith(".js") || !test(fileName)) {
          return;
        }
        try {
          const ast = parse(chunk.code, {
            sourceType: "module",
            allowImportExportEverywhere: true,
            allowReturnOutsideFunction: true,
            plugins: [
              "jsx",
              "typescript",
              "decorators-legacy",
              "classProperties",
              "objectRestSpread",
              "functionBind",
              "exportDefaultFrom",
              "exportNamespaceFrom",
              "dynamicImport",
              "nullishCoalescingOperator",
              "optionalChaining",
              "importMeta"
            ]
          });
          const dsl = dslParse(ast, compress2, ignoreFNames2);
          const dslStr = JSON.stringify(dsl);
          const dslFileName = fileName.replace(/\.js$/, ".dsl.json");
          this.emitFile({
            type: "asset",
            fileName: dslFileName,
            source: dslStr
          });
          jsFileToDslMap.set(fileName, dslFileName);
          if (watch) {
            dslStrMap[fileName] = dslStr;
          }
        } catch (error) {
          console.error(`\u89E3\u6790\u6587\u4EF6 ${fileName} \u65F6\u51FA\u9519:`, error);
        }
      });
      Object.entries(bundle).forEach(([fileName, chunk]) => {
        if (chunk.type === "asset" && fileName.endsWith(".html")) {
          let htmlContent = chunk.source;
          htmlContent = htmlContent.replace(
            /<script([^>]*?)src="([^"]*\.js)"([^>]*?)>/g,
            (match, beforeSrc, jsPath, afterSrc) => {
              const jsFileName = jsPath.replace(/^.*\//, "");
              const dslFileName = jsFileToDslMap.get(jsFileName);
              if (dslFileName) {
                const dslPath = jsPath.replace(/\.js$/, ".dsl.json");
                if (!match.includes("mp-web-package-url=")) {
                  return `<script${beforeSrc}src="${jsPath}"${afterSrc} mp-web-package-url="${dslPath}">`;
                }
              }
              return match;
            }
          );
          chunk.source = htmlContent;
        }
      });
    },
    buildEnd() {
      if (watch && Object.keys(dslStrMap).length > 0) {
        setTimeout(() => {
          Object.entries(dslStrMap).forEach(([entry, dslStr]) => {
            console.log("\u66F4\u65B0\u6587\u4EF6\uFF1A", entry);
            send(JSON.stringify({
              entry,
              dslStr
            }));
          });
          Object.keys(dslStrMap).forEach((key) => delete dslStrMap[key]);
        }, 0);
      }
    },
    buildStart() {
      Object.keys(dslStrMap).forEach((key) => delete dslStrMap[key]);
    },
    transformIndexHtml: injectHtmlAttribute ? {
      order: "post",
      handler(html, context) {
        return html.replace(
          /<script([^>]*?)src="([^"]*\.js)"([^>]*?)>/g,
          (match, beforeSrc, jsPath, afterSrc) => {
            const jsFileName = jsPath.replace(/^.*\//, "");
            if (!match.includes("mp-web-package-url=")) {
              const dslPath = jsPath.replace(/\.js$/, ".dsl.json");
              return `<script${beforeSrc}src="${jsPath}"${afterSrc} mp-web-package-url="${dslPath}">`;
            }
            return match;
          }
        );
      }
    } : void 0
  };
}
var index_default = kbsDslParser;
export {
  index_default as default,
  kbsDslParser
};
