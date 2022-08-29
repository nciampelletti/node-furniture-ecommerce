const express = require("express")
require("dotenv").config()
require("express-async-errors")

const app = express()

//rest of the packages
const morgan = require("morgan")

const authRouter = require("./routes/authRoutes")

const notFoundMiddlewear = require("./middleware/not-found")
const errorHandlerMiddlewear = require("./middleware/error-handler")

const port = process.env.PORT || 4000
const con = process.env.DATABASE

const connectDB = require("./db/connect")

app.use(morgan("tiny"))
app.use(express.json())

// app.get("/", (req, res) => {
//   res.send("hello")
// })

app.use("/api/v1/auth", authRouter)

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
