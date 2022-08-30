const User = require("../model/User")
const CustomError = require("../errors")
const { StatusCodes } = require("http-status-codes")
const { attachCookiesToResponse, createTokenUser } = require("../utils")

exports.register = async (req, res) => {
  const { name, email, password } = req.body

  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? "admin" : "user"

  const user = await User.create({ name, email, password, role })

  const tokenUser = createTokenUser(user)

  //just attach cookie to the resposne
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.CREATED).json({
    user: tokenUser,
  })
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password")
  }

  const user = await User.findOne({ email })

  if (!user || !(await user.comparePassword(password))) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials")
  }

  const tokenUser = createTokenUser(user)

  //just attach cookie to the resposne
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.CREATED).json({
    user: tokenUser,
  })
}

/*
- [] set token cookie equal to some string value
- [] set expires:new Date(Date.now())
*/

exports.logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })
  res.status(StatusCodes.OK).json({ msg: "user logged out!" })
}
