// 综合测试 ES6+ 语法支持

// 类声明
class Calculator {
  constructor(initialValue = 0) {
    this.value = initialValue;
  }

  add(num) {
    this.value += num;
    return this;
  }

  static create(value) {
    return new Calculator(value);
  }
}

// 模板字符串和箭头函数
const numbers = [1, 2, 3, 4, 5];
const formatNumber = (num) => `Number: ${num}`;

// for...of 循环
for (const num of numbers) {
  console.log(formatNumber(num));
}

// 展开语法
const moreNumbers = [6, 7, 8];
const allNumbers = [...numbers, ...moreNumbers];

// 解构赋值
const [first, second, ...rest] = allNumbers;
const { value } = new Calculator(10);

console.log(`First: ${first}, Second: ${second}, Rest: ${rest.join(", ")}`);
console.log(`Calculator value: ${value}`);
