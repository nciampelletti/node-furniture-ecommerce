const express = require("express")
const router = express.Router()

const {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController")

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication")

router
  .route("/")
  .get(getAllProducts) //access to public
  .post(authenticateUser, authorizePermissions("admin"), createProduct)

router
  .route("/:id")
  .get(getSingleProduct) //access to public
  .patch(authenticateUser, authorizePermissions("admin"), updateProduct)
  .delete(authenticateUser, authorizePermissions("admin"), deleteProduct)

router
  .route("/uploadImage")
  .post(authenticateUser, authorizePermissions("admin"), uploadImage)

module.exports = router
