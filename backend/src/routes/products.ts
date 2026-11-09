import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', asyncHandler(getProducts));
router.get('/:slug', asyncHandler(getProductBySlug));
router.post('/', authenticate, requireAdmin, asyncHandler(createProduct));
router.put('/:id', authenticate, requireAdmin, asyncHandler(updateProduct));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(deleteProduct));

export default router;
