import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(getCart));
router.post('/items', asyncHandler(addToCart));
router.put('/items/:itemId', asyncHandler(updateCartItem));
router.delete('/items/:itemId', asyncHandler(removeFromCart));

export default router;
