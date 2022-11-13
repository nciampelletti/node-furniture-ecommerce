require("dotenv").config()
require("express-async-errors")

const express = require("express")
const app = express()

//rest of the packages
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")

//security packages
const rateLimiter = require("express-rate-limit")
const helmet = require("helmet")
const xss = require("xss-clean")
const cors = require("cors")
const mongoSanitize = require("express-mongo-sanitize")

//DATABASE
const connectDB = require("./db/connect")

const port = process.env.PORT || 4000
const con = process.env.DATABASE

app.set("trust proxy", 1)

//limit requests from the same API
const limiter = rateLimiter({
  max: 60, //allowed 60 requests from the same IP per 15 mins
  windowMs: 15 * 60 * 1000, //15mins * 60sec *  1000msec
  message: "Too many requests from this IP. Please try again in an hour",
})
app.use("/api", limiter) //we apply only to api routes

//Data sanitization against NoSQL query injections
app.use(mongoSanitize())
//Data sanitization against XSS attacks
//that will clean input from mellicious HTML
app.use(xss())
// // Implement CORS
const allowedDomains = [
  "http://localhost:3000",
  "https://ciampelletti-ecommerce.netlify.app",
]

app.use(
  cors({
    origin: allowedDomains,
    methods: ["GET", "PATCH", "PUT", "DELETE", "POST", "patch"],
    credentials: true,
  })
)

//Set security HTTP HEADERS
app.use(helmet()) //secure header

// app.use(morgan("tiny"))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET_KEY))
app.use(express.static("./public"))
app.use(fileUpload())

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
