const express = require("express");
const { writeFile, createReadStream,readFile } = require("fs-extra");
const multer = require("multer");
const upload = multer();
const router = express.Router();

const { join } = require("path");
const projectsFolder = join(__dirname,'../../public/products')


router.post('/:id',upload.array('product'),async (req,res)=>{

    try {
        const file = await readFile(join(__dirname,'../service/products/products.json'))
        const products = await JSON.parse(file);
        products.map(e => {
          console.log(e)
          if (e._id === req.params.id) {
            req.files.map(img =>{
              e.imageUrl.push(`http://localhost:3002/${e.id+img.originalname}/download`)
            })
          }
        })
        writeFile(join(__dirname,'../service/products/products.json'),JSON.stringify(products))
        
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

router.get("/:name/download", (req, res, next) => {
    // file as a stream (source) [--> transform optional] --> response (destination)
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