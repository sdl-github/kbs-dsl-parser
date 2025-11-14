// 测试现代 JavaScript 语法

// import.meta (在 Vite 环境中常见)
console.log('Environment:', import.meta.env?.MODE || 'unknown');

// 可选链操作符
const user = {
  profile: {
    name: 'Alice',
    settings: {
      theme: 'dark'
    }
  }
};

const theme = user?.profile?.settings?.theme;
const nonExistent = user?.profile?.avatar?.url;

console.log('Theme:', theme);
console.log('Avatar URL:', nonExistent);

// 空值合并操作符
const defaultTheme = theme ?? 'light';
const defaultName = user?.profile?.name ?? 'Anonymous';

console.log('Default theme:', defaultTheme);
console.log('Default name:', defaultName);

// 可选调用
const callback = user?.profile?.onUpdate;
callback?.('theme changed');

// 动态导入 (如果支持的话)
// const module = await import('./some-module.js');

console.log('Modern JS features test completed');