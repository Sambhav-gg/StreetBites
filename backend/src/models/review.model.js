import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person", // Assuming your user model is called "Person"
      required: true,
    },
    stall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stall", // Assuming your shop model is called "Shop"
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
