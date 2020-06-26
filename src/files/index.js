const express = require("express");
const { writeFile, createReadStream } = require("fs-extra");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const { join } = require("path");
const projectsFolder = join(__dirname,'../../public/products')


router.post('/',upload.array('product'),async (req,res)=>{



    try {
        const promisesArray = req.files.map(e =>{
            writeFile(join(projectsFolder, e.originalname),
            e.buffer)
        })

      await Promise.all(promisesArray)
      res.send('ok')
    } catch (error) {
      console.log(join(projectsFolder, req.file.originalname))
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