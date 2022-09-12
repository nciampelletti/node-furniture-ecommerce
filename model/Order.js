const mongoose = require("mongoose")

const OrderItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
})

const orderSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      required: [true, "Please provide product tax"],
      default: 0,
    },
    shippingFee: {
      type: Number,
      required: [true, "Please provide product shipping fee"],
      default: 0,
    },
    subtotal: {
      type: Number,
      required: [true, "Please provide product subtotal"],
      default: 0,
    },
    total: {
      type: Number,
      required: [true, "Please provide product total"],
      default: 0,
    },
    orderItems: [OrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Order", orderSchema)
