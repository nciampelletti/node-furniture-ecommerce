const mongoose = require("mongoose")
const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide a review rating"],
    },
    title: {
      type: String,
      required: [true, "Please provide a review title"],
      trim: true,
      maxLength: 100,
    },
    comment: {
      type: String,
      trim: true,
      required: [true, "Please provide a review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
)

//only one review per product - per user!
reviewSchema.index({ product: 1, user: 1 }, { unique: true })

module.exports = mongoose.model("Review", reviewSchema)
