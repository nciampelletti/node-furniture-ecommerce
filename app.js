require("dotenv").config()
require("express-async-errors")

const express = require("express")
const app = express()

//rest of the packages
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const fileUpload = require("express-fileupload")

//DATABASE
const connectDB = require("./db/connect")

const port = process.env.PORT || 4000
const con = process.env.DATABASE

app.use(morgan("tiny"))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET_KEY))
app.use(cors())
app.use(express.static("./public"))
app.use(fileUpload())

app.get("/", (req, res) => {
  res.send("hello")
})

app.get("/api/v1", (req, res) => {
  console.log("sadas", req.signedCookies)
  res.send("coocies")
})

//ROUTERS
const authRouter = require("./routes/authRoutes")
const userRouter = require("./routes/userRoutes")
const productRouter = require("./routes/productRoutes")
const reviewRouter = require("./routes/reviewRoutes")
const orderRouter = require("./routes/orderRoutes")

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/orders", orderRouter)

// middleware
const notFoundMiddlewear = require("./middleware/not-found")
const errorHandlerMiddlewear = require("./middleware/error-handler")

app.use(notFoundMiddlewear)
app.use(errorHandlerMiddlewear)

const start = async () => {
  try {
    //connect to MongoDB
    await connectDB(con)

    app.listen(port, () => {
      console.log(`Server is started on port: ${port}...`)
    })
  } catch (error) {
    console.log(error.message)
  }
}

start()
