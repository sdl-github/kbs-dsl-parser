<template>
  <div class="app">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <button @click="handleClick">Click me!</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      title: 'KBS DSL Parser Demo',
      description: 'This Vue app demonstrates the vite-plugin-kbs-dsl in action'
    }
  },
  methods: {
    handleClick() {
      const timestamp = new Date().toISOString()
      const message = `Button clicked at ${timestamp}`
      console.log(message)
      alert(message)
    }
  }
}
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #42b883;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #369870;
}
</style>