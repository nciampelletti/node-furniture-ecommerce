const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provise name"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    require: [true, "Please provide an email"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    // match: [
    //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    //   'Please provide valid email',
    // ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide user password"],
    minLength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
})

module.exports = mongoose.model("User", userSchema)
