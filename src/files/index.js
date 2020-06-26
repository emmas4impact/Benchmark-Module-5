const express = require("express");
const { writeFile, createReadStream } = require("fs-extra");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const fs = require('fs-extra')
const { join } = require("path");
const projectsFolder = join(__dirname,'../../public/products')


router.post('/:id',upload.array('product'),async (req,res)=>{

    try {
        const file = fs.readFile(join(__dirname,"../service/products/products.json"))
        const products = JSON.parse(file)
        console.log(products)
        products.map(e => {
            if(e._id === req.params.id){
                console.log(e.name)
               req.files.map(img=>{
                e.imageUrl.push(`http://localhost:3005/files/${req.params.id + img.originalname}/download`)
               })
            }
        })
        fs.writeFile(join(__dirname,"../service/products/products.json"),JSON.stringify(products))
        const promisesArray = req.files.map(e =>{
            writeFile(join(projectsFolder, `${req.params.id + e.originalname}`),
            e.buffer)
        })

      await Promise.all(promisesArray)
      res.send('ok')
    } catch (error) {
      console.log(error)
    }
})

router.get("/:name/download", (req, res,) => {
    // file as a stream (source) [--> transform optional] --> response (destination)
    const products = fs.readFile(join(__dirname,"../service/products/products.json"))
    const source = createReadStream(
      join(projectsFolder, `${req.params.name}`)
    )
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${req.params.name}`
    ) // please open "Save file to disk window" in browsers
    source.pipe(res)
  })

module.exports = router