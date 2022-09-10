const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
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

userSchema.pre("save", async function (next) {
  // console.log(this.modifiedPaths())
  // console.log(this.isModified("name"))

  //to prevent re-hashing password again and again on update of name/email
  //rehash or hash ONLY if password is modified
  if (!this.isModified("password")) return

  const salt = await bcrypt.genSalt(10)
  const hashedPwd = await bcrypt.hash(this.password, salt)

  this.password = hashedPwd
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model("User", userSchema)
