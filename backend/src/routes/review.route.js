// review.route.js (ESM version)
import express from 'express';
// src/routes/review.route.js
import { addReview, getReviewsForStall, getUserReviews } from '../controllers/review.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, addReview);
router.get('/:stallId', getReviewsForStall);
router.get("/user/:userId", getUserReviews);

export default router;
