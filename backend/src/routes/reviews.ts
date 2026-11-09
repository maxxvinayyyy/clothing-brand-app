import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { getProductReviews, createReview } from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/:productId', asyncHandler(getProductReviews));
router.post('/:productId', authenticate, asyncHandler(createReview));

export default router;
