const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const {verifToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken")


router.put("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString()
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true});                              // send new user

        res.status(500).json(updatedUser)
    }catch (e) {
        res.status(500).json(e)
    }
})

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{
     try{
         await User.findByIdAndDelete(req.params.id)
         res.status(200).json("user has been deleted")
     }catch (e) {
         res.status(500).json(e)
     }
})


// GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        const {password, ...others} = user._doc
        res.status(200).json(others)
    }catch (e) {
        res.status(500).json(e)
    }
})

router.get("/", verifyTokenAndAdmin, async (req, res)=>{
    const query = req.query.new
    try{
        const {password, ...others} = users
        const users = query ? await User.find().sort({ _id: -1}).limit(5) : await User.find();
        res.status(200).json(users)
    }catch (e) {
        res.status(500).json(e)
    }
})

//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res)=>{
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1))  // last year today
    
    try{
        const data = await User.aggregate([
            {$match:{ createdAt: {$gte: lastYear}}},
            {
                $project:{
                    month:{$month:"$createdAt"},
                },
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum: 1},
                },
            }
        ])
        res.status(200).json(data)          // show data monthly
    }catch (e) {
        res.status(500).json(e)
    }
})

module.exports = router;