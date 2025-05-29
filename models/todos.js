let todos = []
let nextId = 1

class Todo {
  constructor(title, description = "", completed = false) {
    this.id = nextId++
    this.title = title
    this.description = description
    this.completed = false
    this.createdAt = new Date()
  }

  static getAll() {
    return todos
  }

  static getById(id) {
    return todos.find((todo) => todo.id === parseInt(id))
  }

  static create(title, description) {
    if (!title) {
      throw new Error("Title is required")
    }

    const newTodo = new Todo(title, description)
    todos.push(newTodo)
  }

  static update(id, updates) {
    const todo = Todo.getById(id)

    if (!todo) {
      return null
    }
    if (updates.title !== undefined) {
      todo.title = updates.title
    }
    if (updates.description !== undefined) {
      todo.description = updates.description
    }
    if (updates.completed !== undefined) {
      todo.completed = updates.completed
    }

    return todo
  }

  static delete(id) {
    const initialLength = todos.length
    todos = todos.filter((todo) => todo.id !== parseInt(id))
    return todos.length < initialLength // Return true if deleted, false otherwise
  }
}

module.exports = Todo

