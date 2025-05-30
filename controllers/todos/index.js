const Todo = require("../../models/todos.js")

const errorBuilder = (error, message = "not found", status = 500, res) => {
  if (error) {
    console.error(error)
  }

  const errorResponse = JSON.stringify({
    status: "error",
    code: status,
    response: message
  })

  res.writeHead(status, { "Content-Type": "application/json" })
  res.end(errorResponse)
}

const resBuilder = (responseObject, status = 200, res) => {
  const response = JSON.stringify(responseObject)

  res.writeHead(status, { "Content-Type": "application/json" })
  res.end(response)
}

/**
 * Handles getting todos for incoming HTTP requests.
 *
 * @function router
 * @param {http.IncomingMessage} req - The HTTP request object.
 * @param {http.ServerResponse} res - The HTTP response object.
 */
exports.getTodos = async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
    const queryParams = Object.fromEntries(parsedUrl.searchParams.entries())

    let _todos = []

    if (queryParams?.id) {
      const todos = Todo.getById(queryParams.id)
      _todos.push(fetchedTodo)
    } else {
      const todos = Todo.getAll()
      _todos = todos
    }

    resBuilder(
      {
        status: "ok",
        code: 200,
        data: _todos
      },
      200,
      res
    )
  } catch (error) {
    errorBuilder(null, "Internal Server Error", 500, res)
  }
}

/**
 * Handles creating todos for incoming HTTP requests.
 *
 * @function router
 * @param {http.IncomingMessage} req - The HTTP request object.
 * @param {http.ServerResponse} res - The HTTP response object.
 */
exports.createTodos = async (req, res) => {
  try {
    let body = ""
    req.on("data", (chunk) => {
      body += chunk
    })
    req.on("end", () => {
      let parsedBody
      try {
        parsedBody = JSON.parse(body)
      } catch (e) {
        parsedBody = body // fallback if not JSON
      }

      if (typeof parsedBody === "object") {
        Todo.create(parsedBody?.title, parsedBody?.description)
        resBuilder({ status: "ok", code: 200, data: "Successful" }, 200, res)
      } else {
        errorBuilder(null, "Bad request", 400, res)
      }
    })
  } catch (error) {
    errorBuilder(null, "Internal Server Error", 500, res)
  }
}

/**
 * Handles update todos logic for incoming HTTP requests.
 *
 * @function router
 * @param {http.IncomingMessage} req - The HTTP request object.
 * @param {http.ServerResponse} res - The HTTP response object.
 */
exports.updateTodos = async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
    const queryParams = Object.fromEntries(parsedUrl.searchParams.entries())

    let body = ""

    req.on("data", (chunk) => {
      body += chunk
    })
    req.on("end", () => {
      let parsedBody
      try {
        parsedBody = JSON.parse(body)
      } catch (e) {
        parsedBody = body // fallback if not JSON
      }

      if (typeof parsedBody === "object" && queryParams?.id) {
        const todo = Todo.update(queryParams.id, parsedBody)

        if (todo) {
          resBuilder({ status: "ok", code: 200, data: todo }, 200, res)
        } else {
          resBuilder({ status: "ok", code: 204, data: {} }, 204, res)
        }
      } else {
        errorBuilder(null, "Bad request", 400, res)
      }
    })
  } catch (error) {
    errorBuilder(null, "Internal Server Error", 500, res)
  }
}

/**
 * Handles deleting todos logic for incoming HTTP requests.
 *
 * @function router
 * @param {http.IncomingMessage} req - The HTTP request object.
 * @param {http.ServerResponse} res - The HTTP response object.
 */
exports.deleteTodos = async (req, res) => {
  try {
    const { url } = req.url
    const parsedUrl = new URL(url, `http://${req.headers.host}`)
    const queryParams = Object.fromEntries(parsedUrl.searchParams.entries())

    const successful = Todo.delete(queryParams.id)

    if (successful) {
      resBuilder(
        {
          status: "ok",
          code: 204
        },
        204,
        res
      )
    } else {
      errorBuilder(null, "Not Found", 404, res)
    }
  } catch (error) {
    errorBuilder(null, "Internal Server Error", 500, res)
  }
}

