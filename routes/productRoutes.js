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

const { getSingleProductReviews } = require("../controllers/reviewController")

router
  .route("/")
  .get(getAllProducts) //access to public
  .post([authenticateUser, authorizePermissions("admin")], createProduct)

//make sure it is pit befor /:id route so it doesnt get treated as /:id route
router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermissions("admin")], uploadImage)

router
  .route("/:id")
  .get(getSingleProduct) //access to public
  .patch([authenticateUser, authorizePermissions("admin")], updateProduct)
  .delete([authenticateUser, authorizePermissions("admin")], deleteProduct)

router.route("/:id/reviews").get(getSingleProductReviews)

module.exports = router
