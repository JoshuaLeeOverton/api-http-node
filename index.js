const http = require("http")

const PORT = 9000

const server = http.createServer((req, res) => {
  const url = req.url
  const method = req.method

  console.log(`Server Traffic: ${method}:${url}`)

  res.statusCode = 200
  res.setHeader("Content-Type", "text/plain")
  res.end("Hello World\n")
})

server.listen(PORT, () => {
  console.log(`HTTP_NODE server running, http://localhost:${PORT}/`)
})

