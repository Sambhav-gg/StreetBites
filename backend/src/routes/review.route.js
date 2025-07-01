// review.route.js (ESM version)
import express from 'express';
// src/routes/review.route.js
import { addReview, getReviewsForStall } from '../controllers/review.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, addReview);
router.get('/:stallId', getReviewsForStall);

export default router;
