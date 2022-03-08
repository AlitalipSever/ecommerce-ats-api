const express = require("express")
const app = express()
const dotenv = require("dotenv")

const connectDB = require("./database/setup")

const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")

dotenv.config()

app.use(express.json())
//TODO route not found add
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);


const start = async () => {
  try {
      await connectDB(process.env.MONGO_URL)
      app.listen(process.env.PORT || 5001, ()=>{
          console.log(`Server is running at ${process.env.PORT}...`);
      })
  }catch (e) {
      console.log(e);
  }
}

start().catch(console.error)

module.exports = app