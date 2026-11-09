import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from '../controllers/orderController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', asyncHandler(createOrder));
router.get('/', asyncHandler(getUserOrders));
router.get('/all', requireAdmin, asyncHandler(getAllOrders));
router.get('/:id', asyncHandler(getOrderById));
router.put('/:id/status', requireAdmin, asyncHandler(updateOrderStatus));

export default router;
