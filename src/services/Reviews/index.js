const express = require("express")
const fs = require("fs-extra")
const path = require ("path")
const {body,validationResult} = require("express-validator")
const uniqid = require("uniqid")
const router = express.Router()
const reviewFilePath = path.join(__dirname ,"Review.json")
const readFiles = (file) => {
    const reviewFileContentAsBuffer = fs.readFileSync(reviewFilePath)
    const reviewFileContentAsJSON = JSON.parse(reviewFileContentAsBuffer.toString())
    return reviewFileContentAsJSON;
}
router.get("/" , (req,res,next) => {
    const file = readFiles("Review.json")
    res.send(file)
})

router.get("/:id" , (req,res,next) => {
    const reviewArray = readFiles("Review.json")
    const review = reviewArray.filter((review) => parseInt(review.id) === parseInt(req.params.id))
    res.send(review)
})

router.post("/:id" , [body("comment").exists().isLength({min:4}),body("rate").exists()] ,(req,res,next) => {
    try {
        const err = validationResult(req)
        if (!err.isEmpty()){
            res.send(err)
        }
        else{
            const newReview = {...req.body , id:uniqid() , elementID: req.params.id ,createdAt: new Date()}
            const file = readFiles("Review.json")
            file.push(newReview)
            fs.writeFileSync(reviewFilePath , JSON.stringify(file))
            res.send(newReview)
        }
    } catch (error) {
        next(error)
    }
})

router.put("/:id" , (req,res,next) => {
    const file = readFiles("Review.json")
    const editReview = file.filter(review=> review.id !== req.params.id)
    const review = req.body
    review.id = req.params.id
    editReview.push(review)
    fs.writeFileSync(reviewFilePath,JSON.stringify(editReview))
    res.send(editReview)
})
router.delete("/:id" , (req,res,next) => {
    const file = readFiles("Review.json")
    const deleteReview = file.filter(review=> review.id !== req.params.id)
    fs.writeFileSync(reviewFilePath,JSON.stringify(deleteReview))
    res.send(deleteReview)
})
module.exports = router