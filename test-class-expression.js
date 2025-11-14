// 测试类表达式
const MyClass = class {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return `Hello, ${this.name}!`;
  }
};

// 匿名类表达式
const AnotherClass = class extends MyClass {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
  
  introduce() {
    return `${this.greet()} I'm ${this.age} years old.`;
  }
};

// 立即使用类表达式
const instance = new (class {
  constructor() {
    this.value = 42;
  }
  
  getValue() {
    return this.value;
  }
})();

console.log(new MyClass('World').greet());
console.log(new AnotherClass('Alice', 25).introduce());
console.log(instance.getValue());