// 测试 for...of 循环
const numbers = [1, 2, 3, 4, 5];
const fruits = ['apple', 'banana', 'orange'];

// 基本 for...of 循环
for (const num of numbers) {
  console.log(`Number: ${num}`);
}

// 使用 let 声明
for (let fruit of fruits) {
  fruit = fruit.toUpperCase();
  console.log(`Fruit: ${fruit}`);
}

// 遍历字符串
const text = 'hello';
for (const char of text) {
  console.log(`Character: ${char}`);
}

// 嵌套循环
for (const num of numbers) {
  for (const fruit of fruits) {
    console.log(`${num}: ${fruit}`);
  }
}