const Product = require("../model/Product")
const CustomError = require("../errors")
const { StatusCodes } = require("http-status-codes")
const path = require("path")

exports.getAllProducts = async (req, res) => {
  const products = await Product.find({})

  res.status(StatusCodes.OK).json({
    products,
    count: products.count,
  })
}

exports.createProduct = async (req, res) => {
  req.body.user = req.user.userId

  const product = await Product.create(req.body)

  res.status(StatusCodes.CREATED).json({
    product,
  })
}

exports.getSingleProduct = async (req, res) => {
  const { id: productId } = req.params

  const product = await Product.findOne({ _id: productId })

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`)
  }
  res.status(StatusCodes.OK).json({
    product,
  })
}

exports.updateProduct = async (req, res) => {
  const { id: productId } = req.params

  const product = await Product.findByIdAndUpdate(
    { _id: productId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`)
  }
  res.status(StatusCodes.OK).json({
    product,
  })
}

exports.deleteProduct = async (req, res) => {
  const { id: productId } = req.params

  const product = await Product.findOne({ _id: productId })

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`)
  }

  await product.remove()

  res.status(StatusCodes.OK).json({
    msg: "Success. Product removed!",
  })
}

exports.uploadImage = async (req, res) => {
  console.log(req.files)

  if (!req.files) {
    throw new CustomError.BadRequestError("No files Uploaded")
  }

  const productImage = req.files.image

  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload image")
  }

  const maxSize = 1024 * 1024

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload image smaller than 1MB"
    )
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  )

  await productImage.mv(imagePath)

  res.status(StatusCodes.OK).json({
    image: `/uploads/${productImage.name}`,
  })
}
