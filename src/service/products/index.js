const express = require("express")
const fs = require("fs")
const path = require("path")
const {join} = require("path")
const multer = require("multer")
const {writeFile} = require("fs-extra")
const uniqid = require("uniqid")
const port = process.env.PORT || 3005
const { body, validationResult } = require("express-validator")


const router = express.Router()
const upload = multer({})
const productsFolderPath =join(__dirname, "../../../public/image/products")
const readFile = (fileName) => {
  const buffer = fs.readFileSync(path.join(__dirname, fileName))
  const fileContent = buffer.toString()
  return JSON.parse(fileContent)
}



router.post("/:_id/upload", upload.single("avatar"), async (req, res, next) => {
  
  console.log(req.file.buffer)
  try {
    const productsDB = readFile("products.json")
    
    const newDb = productsDB.map((x) => {
      if(x.productId === req.params.productId){
          x.image = `http://localhost:${port}/image/products/${req.params._id}.jpg`
      }
      return x;
  })

    fs.writeFileSync(path.join(__dirname, "products.json"), JSON.stringify(newDb))

    await writeFile(
      join(productsFolderPath, `${req.params._id}.jpg`),
      req.file.buffer
    )
  } catch (error) {
    console.log(error)
  }
  res.send("ok")
})
router.get("/:id", (req, res, next) => {
  try {
    const usersDB = readFile("products.json")
    const user = usersDB.filter((user) => user._id === req.params.id)
    res.send(user)
  } catch (error) {
    error.httpStatusCode = 404
    next(error)
  }
})

router.get("/", (req, res) => {
  const usersDB = readFile("products.json")
  if (req.query && req.query.name) {
    const filteredUsers = usersDB.filter(
      (user) =>
        user.hasOwnProperty("name") &&
        user.name.toLowerCase() === req.query.name.toLowerCase()
    )
    res.send(filteredUsers)
  } else {
    res.send(usersDB)
  }
})

router.post(
  "/",
 [body('name').exists().isLength({min:3}),
 body('description').isLength({min:7}),
 body('brand').exists(),
 body('price').exists().isNumeric()],
  (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.send(errors)
      }else{
          
        const usersDB = readFile("products.json")
        const newUser = {
          ...req.body,
          _id: uniqid(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
  
        usersDB.push(newUser)
  
        fs.writeFileSync(
          path.join(__dirname, "products.json"),
          JSON.stringify(usersDB)
        )
  
        res.status(201).send(usersDB)
          
      }
     
    } catch (error) {
      next(error)
    }
  }
)

router.delete("/:_id", (req, res) => {
  const usersDB = readFile("products.json")
  const newDb = usersDB.filter((x) => x.ID !== req.params.id)
  fs.writeFileSync(path.join(__dirname, "products.json"), JSON.stringify(newDb))

  res.json(newDb)
})

router.put("/:id", (req, res) => {
  const usersDB = readFile("products.json")
  const newDb = usersDB.filter(x => x._id !== req.params.id) 
  const users = req.body
  users._id = req.params.id
  newDb.push(users) 
  fs.writeFileSync(path.join(__dirname, "products.json"), JSON.stringify(newDb))
  res.send(newDb)
})


module.exports = router
