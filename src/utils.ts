// sort-hand
const resolveFunKeysMap: Record<string, string> = {
  'getValue': 'gV',
  'let': 'l',
  'var': 'v',
  'batchLet': 'bL',
  'batchVar': 'bV',
  'batchDeclaration': 'bD',
  'getConst': 'gC',
  'getLet': 'gL',
  'getVar': 'gVar',
  'getFunction': 'gF',
  'getArg': 'gA',
  'getObjMember': 'gOM',
  'getOrAssignOrDissocPath': 'gADP',
  'assignLet': 'aL',
  'getResultByOperator': 'gRBO',
  'setLet': 'sL',
  'callReturn': 'cR',
  'callBreak': 'cBr',
  'callContinue': 'cCo',
  'callUnary': 'cU',
  'callBinary': 'cB',
  'callUpdate': 'cUp',
  'callLogical': 'cL',
  'callThrow': 'cT',
  'callWhile': 'cW',
  'callDoWhile': 'cDW',
  'callFor': 'cF',
  'callForIn': 'cFI',
  'callForOf': 'cFO',
  'destroy': 'd',
  'delete': 'del',
  'createFunction': 'f',
  'callBlockStatement': 'cBS',
  'callIfElse': 'cIE',
  'callConditional': 'cC',
  'getRegExp': 'gRE',
  'newClass': 'nC',
  'callFun': 'c',
  'callTryCatch': 'cTC',
  'callSwitch': 's',
  'callSequence': 'cS',
  'addLabel': 'aL',
  'removeLabel': 'rL',
  'templateLiteral': 'tL',
  'spreadElement': 'sE',
  'classExtends': 'cE',
  'destructureAssign': 'dA'
}

const resolveTypeKeysMap: Record<string, string> = {
  'call-function': 'c',
  'customize-function': 'f',
  'declare-function': 'd',
  component: 'f',
  'array-literal': 'a',
  'object-literal': 'o',
  literal: 'l',
  'prefix-vars': 'p',
  'member': 'm',
  'label-statement': 'ls',
  'this': 't',
  'array-pattern': 'ap',
  'object-pattern': 'op',
  'identifier-pattern': 'ip',
  'rest-pattern': 'rp',
  'unknown-pattern': 'up'
}

const dslObjKeyNamesMap: Record<string, string> = {
  type: 't',
  name: 'n',
  value: 'v',
  params: 'p',
  body: 'b',
  key: 'k'
}

export const getCallFunName = (name: string, compress = false): string => {
  if (!compress || !resolveFunKeysMap[name]) return name
  return resolveFunKeysMap[name]
}

export const getTypeName = (name: string, compress = false): string => {
  if (!compress || !resolveTypeKeysMap[name]) return name
  return resolveTypeKeysMap[name]
}

export const getKeyName = (name: string, compress = false): string => {
  if (!compress || !dslObjKeyNamesMap[name]) return name
  return dslObjKeyNamesMap[name]
}