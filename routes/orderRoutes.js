const express = require("express")
const router = express.Router()

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication")

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderController")

router
  .route("/")
  .get([authenticateUser, authorizePermissions("admin")], getAllOrders)
  .post(authenticateUser, createOrder)

//must be abouve /:id route, otherwise it would treated as /:id rout
router.route("/showAllMyOrders").get(getCurrentUserOrders)

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)

module.exports = router
