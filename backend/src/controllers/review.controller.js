// src/controllers/review.controller.js
import Review from '../models/review.model.js';
import Stall from '../models/stall.model.js'; // assuming you meant "Stall", not "Shop"

export const getReviewsForStall = async (req, res) => {
  const { stallId } = req.params;

  try {
    const reviews = await Review.find({ stall: stallId }).populate('user', 'name profilePhoto');

    const allReviews = await Review.find({ stall: stallId });
    const numReviews = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;
    
    res.status(200).json(reviews, allReviews, numReviews, avgRating);
  } catch (err) {
    console.error('[getReviewsForStall]', err);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

export const addReview = async (req, res) => {
  const { rating, comment, stallId } = req.body;
  const userId = req.user._id;
  console.log("[Review Body] bhaai yeh controller h ", { rating, comment, stallId, userId });
  try {
    // Check if user already reviewed this stall
    const existingReview = await Review.findOne({ user: userId, stall: stallId });
    if (existingReview) {
      console.log("User already reviewed this stall");
      return res.status(400).json({ message: 'You have already reviewed this stall' });
    }
    

    // Create new review
    let newReview = await Review.create({
      rating,
      comment,
      user: userId,
      stall: stallId,
    });

    // Populate user details in newReview
    newReview = await newReview.populate('user', 'name profilePhoto');

    // Add review to stall and recalculate stats
    const stall = await Stall.findById(stallId);
    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    stall.reviews.push(newReview._id);

    // Recalculate average rating and number of reviews
    const allReviews = await Review.find({ stall: stallId });
    const numReviews = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

    stall.numReviews = numReviews;
    stall.averageRating = parseFloat(avgRating.toFixed(1));
    await stall.save();

    res.status(201).json({ message: 'Review added', review: newReview });
  } catch (err) {
    console.error('[addReview]', err);
    res.status(500).json({ message: 'Failed to add review' });
  }
};
