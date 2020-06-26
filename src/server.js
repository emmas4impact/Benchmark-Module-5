const express = require("express")
const listEndpoints = require("express-list-endpoints")
const filesRoute = require("./files/index")

const {join}= require("path")

const cors = require("cors")


const server = express()
server.use(express.static(join(__dirname, `../public`)))

const port = process.env.PORT || 3005


server.use(cors())
server.use(express.json()) // Built in middleware

// ROUTES
server.use("/files",filesRoute)

// ERROR HANDLERS


console.log(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
