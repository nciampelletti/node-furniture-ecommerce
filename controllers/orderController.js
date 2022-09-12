const Order = require("../model/Order")
const Product = require("../model/Product")
const CustomError = require("../errors")
const { StatusCodes } = require("http-status-codes")

const { checkPermissions } = require("../utils")

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})

  res.status(StatusCodes.OK).json({
    orders,
    count: orders.count,
  })
}

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params

  const order = await Order.findOne({ _id: orderId })

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${orderId}`)
  }

  //only admin or order owner can get the details
  checkPermissions(req.user, order.user)

  res.status(StatusCodes.OK).json({
    order,
  })
}

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })

  res.status(StatusCodes.OK).json({
    orders,
    count: orders.length,
  })
}

const fakeStripeAPI = ({ amount, currency }) => {
  const client_secret = "someRandonValue"

  return { client_secret, amount }
}

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided")
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError("Please provide tax and shipping fee")
  }

  let orderItems = []
  let subtotal = 0

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product })

    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No product with id: ${item.product}`)
    }

    //pull name, image, price, amount, product
    const { name, image, price, _id } = dbProduct

    const OrderItem = {
      amount: item.amount,
      name,
      image,
      price,
      product: _id,
    }

    //add item to the array of orderItems
    orderItems = [...orderItems, OrderItem]

    //calculate subtotal
    subtotal += item.amount * price
  }

  console.log(orderItems, subtotal)

  const total = subtotal + tax + shippingFee

  //communicate with stripe to get client secret
  //we setup fake function here
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "cad",
  })

  //finallyt create an order
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    paymentIntent,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  })

  res.status(StatusCodes.CREATED).json({
    order,
    clientSecret: order.clientSecret,
  })
}

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params
  const { paymentIntentId } = req.body

  const order = await Order.findOne({ _id: orderId })

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${orderId}`)
  }

  //only admin or order owner can get the details
  checkPermissions(req.user, order.user)

  order.paymentIntentId = paymentIntentId
  order.status = "paid"

  await order.save()

  res.status(StatusCodes.OK).json({
    order,
  })
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
}
