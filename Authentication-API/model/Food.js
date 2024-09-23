const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true},
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    averageRating: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Food", foodSchema);