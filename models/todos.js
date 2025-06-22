const { Pool } = require("pg")

//pgadmin connection this can be in a .env but for now just doing it here
const USER = "postgres"
const HOST = "localhost"
const DATABASE = "postgres"
const PASSWORD = "1234"
const PORT = 5432

const pool = new Pool({
  user: USER,
  host: HOST,
  database: DATABASE,
  password: PASSWORD,
  port: PORT,
  max: 10, // Maximum number of clients in the pool (default is 10)
  idleTimeoutMillis: 30000, // How long a client can remain idle before being closed (30 seconds)
  connectionTimeoutMillis: 2000 // How long to wait for a connect
})

let todos = []
let nextId = 1

const queryPostgres = async (query) => {
  try {
    client = await pool.connect()

    const res = await client.query(query)
    return res?.rows || []
  } catch (error) {
    console.log(error)
    throw new Error(error)
  } finally {
    if (client) {
      client.release()
      console.log("Connection to PostgreSQL closed.")
    }
  }
}

class Todo {
  constructor(title, description = "", completed = false) {
    this.id = nextId++
    this.title = title
    this.description = description
    this.completed = false
    this.createdAt = new Date()
  }

  static async getAll() {
    const res = await queryPostgres("SELECT * FROM todos")
    return res
  }

  static async getById(id) {
    const res = await queryPostgres(`SELECT * FROM todos WHERE id = ${id}`)
    return res[0]
  }

  static async create(title, description = "") {
    if (!title) {
      throw new Error("Title is required")
    }

    console.log(title)
    await queryPostgres({
      text: `INSERT INTO todos (title, description, date) VALUES ($1, $2, $3);`,
      values: [title, description, new Date()]
    })
  }

  static async update(id, updates) {
    const todo = await Todo.getById(id)

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

    const res = await queryPostgres({
      text: `UPDATE todos SET title = $1, description = $2, completed = $3, date = $4 WHERE id = $5;`,
      values: [todo.title, todo.description, todo.completed, new Date(), id]
    })

    return todo
  }

  static async delete(id) {
    const res = await queryPostgres(`DELETE FROM todos WHERE id = ${id};`)
    return true // Return true if deleted, false otherwise
  }
}

module.exports = Todo

