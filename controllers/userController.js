const User = require("../model/User")
const CustomError = require("../errors")
const { StatusCodes } = require("http-status-codes")

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find({ role: "user" }).select("-password")

  res.status(StatusCodes.OK).json({
    users,
  })
}
exports.getSingleUser = async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password")

  if (!user) {
    throw CustomError.NotFoundError("User with this id has not been found", 404)
  }
  res.status(StatusCodes.OK).json({
    user,
  })
}

exports.showCurrentUser = async (req, res, next) => {
  res.send("showCurrentUser")
}

exports.updateUser = async (req, res, next) => {
  res.send("updateUser")
}

exports.updateUserPassword = async (req, res, next) => {
  res.send("updateUserPassword")
}

/*
- [] Get all users where role is 'user' and remove password
- [] Get Single User where id matches id param and remove password
- [] If no user 404
*/
