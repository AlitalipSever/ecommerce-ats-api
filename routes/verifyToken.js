const jwt = require("jsonwebtoken")


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token
    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token,process.env.JWT_SEC,(error, user)=>{
            if(error) res.status(401).json("Token is not valid!")
            req.user = user
            console.log(user);
            next()
        })
    }else{
        res.status(401).json("You are not authenticated!")
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json("Not allowed!")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json("Not allowed!")
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}