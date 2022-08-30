// const {} = require("../controllers/authController")
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController")
const { authenticateUser } = require("../middleware/authentication")

const express = require("express")
const router = express.Router()

router.route("/").get(authenticateUser, getAllUsers)

router.route("/showMe").get(showCurrentUser)
router.route("/updateUser").patch(updateUser)
router.route("/updateUserPassword").patch(updateUserPassword)

router.route("/:id").get(getSingleUser)

module.exports = router
