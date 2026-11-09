import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(getWishlist));
router.post('/', asyncHandler(addToWishlist));
router.delete('/:productId', asyncHandler(removeFromWishlist));

export default router;
