const router = require("express").Router()

const {verifyTokenAndAdmin} = require("../routes/verifyToken");
const Product = require("../models/Product")
const {productSave, productUpdate} = require("../controllers/productService")


//CREATE
router.post("/", verifyTokenAndAdmin, productSave)

//UPDATE
router.put("/:id",verifyTokenAndAdmin, productUpdate)

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json(`productId: ${req.params.id} deleted`)

    }catch (e) {
        res.status(500).json(e)
    }
})

//GET PRODUCTS
router.get("/find/:id", verifyTokenAndAdmin, async (req, res)=>{
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    }catch (e) {
        res.status(500).json(e)
    }
})

//GET ALL PRODUCTS
router.get("/", verifyTokenAndAdmin, async (req, res)=>{
    const qNew = req.query.new
    const qCategory = req.query.category
    //TODO add both query params action
    try {
        let products
        if(qNew){
            products = await Product.find().sort({createdAt:-1}).limit(1)
        }else if(qCategory){
            products = await Product.find({
                categories: {
                    $in: [qCategory],               // find in array and take product
                },
            });
        }else{
            products = await Product.find()
        }
        res.status(200).json(products)
    }catch (e) {
        res.status(500).json(e)
    }
})


module.exports = router;