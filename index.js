const http = require("http")
const { URL } = require("url")
const PORT = 9000
const {
  deleteTodos,
  getTodos,
  updateTodos,
  createTodos
} = require("./controllers/todos")
/**
 * Handles routing for incoming HTTP requests.
 *
 * @function router
 * @param {http.IncomingMessage} req - The HTTP request object.
 * @param {http.ServerResponse} res - The HTTP response object.
 */
const router = (req, res) => {
  const { method } = req

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  )
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization") // Add any custom headers your frontend sends

  console.log(`Server Traffic: ${method}`)

  switch (method) {
    case "OPTIONS":
      res.writeHead(204)
      res.end()
      break
    case "GET":
      getTodos(req, res)
      break
    case "POST":
      createTodos(req, res)
      break
    case "PATCH":
      updateTodos(req, res)
      break
    case "DELETE":
      deleteTodos(req, res)
      break
    default:
      res.statusCode = 404
      res.end("Not Found")
  }
}

const server = http.createServer(router)

server.listen(PORT, () => {
  console.log(`HTTP_NODE server running, http://localhost:${PORT}/`)
})

