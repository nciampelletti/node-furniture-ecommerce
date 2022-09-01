const CustomError = require("../errors")
const { StatusCodes } = require("http-status-codes")

const checkPermissions = (requestUser, resourceUserId) => {
  console.log(requestUser.role)
  console.log(requestUser)
  console.log(resourceUserId)
  console.log(typeof requestUser)

  if (requestUser.role === "admin") return
  if (requestUser.userId === resourceUserId.toString()) return

  //otherwise...
  throw new CustomError.UnauthenticatedError("Not authorized ...")
}

module.exports = checkPermissions
