const User = require("../model/User")
const CustomError = require("../errors")
const { StatusCodes } = require("http-status-codes")
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require("../utils")

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find({ role: "user" }).select("-password")

  res.status(StatusCodes.OK).json({
    users,
  })
}
exports.getSingleUser = async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password")
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`)
  }
  //only user himself or admin can get his info
  checkPermissions(req.user, user._id)

  res.status(StatusCodes.OK).json({
    user,
  })
}

exports.showCurrentUser = async (req, res, next) => {
  res.status(StatusCodes.OK).json({
    user: req.user,
  })
}

//update user with findOneandUpdate
// exports.updateUser = async (req, res, next) => {
//   const { name, email } = req.body

//   if (!name || !email) {
//     throw new CustomError.BadRequestError("Please provide both name and email")
//   }

//   const user = await User.findByIdAndUpdate(
//     { _id: req.user.userId },
//     { name, email },
//     { new: true, runValidators: true }
//   )

//   const tokenUser = createTokenUser(user)

//   //just attach cookie to the resposne
//   attachCookiesToResponse({ res, user: tokenUser })

//   res.status(StatusCodes.OK).json({
//     user: tokenUser,
//   })
// }

//update user with user.save
exports.updateUser = async (req, res, next) => {
  const { name, email } = req.body

  if (!name || !email) {
    throw new CustomError.BadRequestError("Please provide both name and email")
  }

  const user = await User.findOne({ _id: req.user.userId })

  user.name = name
  user.email = email

  await user.save()

  const tokenUser = createTokenUser(user)

  //just attach cookie to the resposne
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.OK).json({
    user: tokenUser,
  })
}

exports.updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Please provide both old and new passwords"
    )
  }

  const user = await User.findById(req.user.userId)

  if (!user || !(await user.comparePassword(oldPassword))) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials")
  }

  user.password = newPassword
  await user.save()

  res.status(StatusCodes.OK).json({
    user,
  })
}
