const express = require("express")
const listEndpoints = require("express-list-endpoints")
const usersRouter = require("./service/products")
//const projectRouter = require("./service/project")
const {join}= require("path")

const cors = require("cors")


const server = express()
server.use(express.static(join(__dirname, `../public`)))

const port = process.env.PORT || 3005

const loggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`)
  next()
}
server.use(cors())
server.use(express.json()) // Built in middleware
server.use(loggerMiddleware)

// ROUTES
server.use("/products", loggerMiddleware, usersRouter)
//server.use("/project",loggerMiddleware, projectRouter)


// ERROR HANDLERS


console.log(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
