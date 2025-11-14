import React, { useState, useEffect } from 'react'

// 函数组件使用 Hooks
function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Test KBS DSL Plugin', completed: true },
    { id: 3, text: 'Build awesome apps', completed: false }
  ])

  // 使用 useEffect Hook
  useEffect(() => {
    const timer = setInterval(() => {
      setMessage(`Current time: ${new Date().toLocaleTimeString()}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 事件处理函数
  const handleIncrement = () => {
    setCount(prev => prev + 1)
  }

  const handleDecrement = () => {
    setCount(prev => prev - 1)
  }

  const toggleTodo = (id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    )
  }

  const addTodo = () => {
    const text = prompt('Enter new todo:')
    if (text) {
      const newTodo = {
        id: Date.now(),
        text,
        completed: false
      }
      setTodos(prev => [...prev, newTodo])
    }
  }

  // 计算属性
  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return React.createElement('div', { className: 'app' },
    React.createElement('header', { className: 'app-header' },
      React.createElement('h1', null, 'React + KBS DSL Demo'),
      React.createElement('p', null, message)
    ),
    
    React.createElement('main', { className: 'app-main' },
      React.createElement('section', { className: 'counter' },
        React.createElement('h2', null, 'Counter Example'),
        React.createElement('div', { className: 'counter-controls' },
          React.createElement('button', { onClick: handleDecrement }, '-'),
          React.createElement('span', { className: 'counter-value' }, count),
          React.createElement('button', { onClick: handleIncrement }, '+')
        )
      ),
      
      React.createElement('section', { className: 'todos' },
        React.createElement('h2', null, 'Todo List'),
        React.createElement('div', { className: 'todo-stats' },
          `${completedCount} of ${totalCount} completed`
        ),
        React.createElement('button', { onClick: addTodo }, 'Add Todo'),
        React.createElement('ul', { className: 'todo-list' },
          ...todos.map(todo =>
            React.createElement('li', { 
              key: todo.id,
              className: todo.completed ? 'completed' : ''
            },
              React.createElement('label', null,
                React.createElement('input', {
                  type: 'checkbox',
                  checked: todo.completed,
                  onChange: () => toggleTodo(todo.id)
                }),
                todo.text
              )
            )
          )
        )
      )
    )
  )
}

export default App