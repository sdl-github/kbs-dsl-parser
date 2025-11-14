// 测试 ES6+ 语法
const name = 'Vue';
const version = 3;

// 模板字符串
const message = `Welcome to ${name} ${version}!`;

// 箭头函数
const add = (a, b) => a + b;
const multiply = (x, y) => {
  return x * y;
};

// 数组方法
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

console.log(message);
console.log(add(2, 3));
console.log(multiply(4, 5));
console.log(doubled);