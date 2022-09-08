const Product = require("../model/Product")
const CustomError = require("../errors")
const { StatusCodes } = require("http-status-codes")

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
  res.send("uploadImage")
}
