const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../routes/verifyToken");
const Cart = require("../models/Cart")
const router = require("express").Router()

//CREATE
router.post("/", verifyToken, async (req, res)=>{
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    }catch (e) {
        res.status(500).json(e)
    }
})

//UPDATE
router.put("/:id",verifyTokenAndAuthorization, async (req, res)=>{
    try{
    const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body
            },
            {new:true}
        );
        res.status(200).json(updatedCart)
    }catch (e) {
        res.status(500).json(e)
    }
})

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json(`Cart: ${req.params.id} deleted`)

    }catch (e) {
        res.status(500).json(e)
    }
})

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res)=>{
    try {
        const cart = await Cart.findOne({userId: req.params.userId})
        res.status(200).json(cart)
    }catch (e) {
        res.status(500).json(e)
    }
})

//GET ALL BY ADMIN
router.get("/", verifyTokenAndAdmin, async (req, res)=>{
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    }catch (e) {
        res.status(500).json(e)
    }
})



module.exports = router;