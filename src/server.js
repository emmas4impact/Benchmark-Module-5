const express = require("express")
const listEndpoints = require("express-list-endpoints")
const usersRouter = require("./service/products")
//const projectRouter = require("./service/project")
const filesRoute = require("./files/index")

const reviewRouter = require("./services/Reviews")
// const projectRouter = require("./service/project")
const {join}= require("path")

const cors = require("cors")


const server = express()
server.use(express.static(join(__dirname, `../public`)))

const port = 3002


server.use(cors())
server.use(express.json()) // Built in middleware

// ROUTES
server.use("/products",  usersRouter)
//server.use("/project",loggerMiddleware, projectRouter)

server.use("/files",filesRoute)
server.use("/reviews",  reviewRouter)
// server.use("/project",loggerMiddleware, projectRouter)
// server.use("/problems", problematicRoutes)

// ERROR HANDLERS


console.log(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
