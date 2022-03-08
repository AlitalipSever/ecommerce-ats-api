const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../routes/verifyToken");
const Order = require("../models/Order")
const router = require("express").Router()

//CREATE
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    } catch (e) {
        res.status(500).json(e)
    }
})

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {new: true}
        );
        res.status(200).json(updatedOrder)
    } catch (e) {
        res.status(500).json(e)
    }
})

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json(`Order: ${req.params.id} deleted`)

    } catch (e) {
        res.status(500).json(e)
    }
})

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({userId: req.params.userId})
        res.status(200).json(orders)
    } catch (e) {
        res.status(500).json(e)
    }
})

//GET ALL BY ADMIN
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
        res.status(200).json(orders)
    } catch (e) {
        res.status(500).json(e)
    }
})

//GET MONTHLY
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();        // first sept
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));       // first aug
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));  // first july

    try {
        const income = await Order.aggregate([
            {$match: {createdAt: {$gte: previousMonth}}},
            {
                $project: {
                    month: {$month: "$createdAt"},
                    sales: "$amount",
                },
            },
            {

                $group:{
                    _id:"$month",
                    total:{$sum: "$sales"},
                },
            },
        ]);

        res.status(200).json(income);
    } catch (e) {
        res.status(500).json(e);
    }
})

module.exports = router;