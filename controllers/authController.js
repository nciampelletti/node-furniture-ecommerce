const User = require("../model/User")
const CustomError = require("../errors/custom-api")
const { StatusCodes } = require("http-status-codes")

exports.register = async (req, res) => {
  const user = await User.create(req.body)

  res.status(StatusCodes.CREATED).json({
    user,
  })
}

exports.login = async (req, res) => {
  res.send("login")
}

exports.logout = async (req, res) => {
  res.send("logout")
}
