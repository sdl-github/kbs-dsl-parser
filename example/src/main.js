// 示例：复杂的 ES5 代码
function Calculator() {
  this.result = 0;
}

Calculator.prototype.add = function(num) {
  this.result += num;
  return this;
};

Calculator.prototype.multiply = function(num) {
  this.result *= num;
  return this;
};

Calculator.prototype.getResult = function() {
  return this.result;
};

// 使用示例
var calc = new Calculator();
var result = calc.add(5).multiply(2).getResult();

console.log('计算结果:', result);

// 条件语句
if (result > 10) {
  console.log('结果大于10');
} else {
  console.log('结果小于等于10');
}

// 循环语句
for (var i = 0; i < 3; i++) {
  console.log('循环:', i);
}

// 数组和对象
var arr = [1, 2, 3];
var obj = {
  name: 'test',
  value: 42
};

// 异常处理
try {
  throw new Error('测试错误');
} catch (e) {
  console.log('捕获错误:', e.message);
}