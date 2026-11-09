import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', asyncHandler(getCategories));
router.post('/', authenticate, requireAdmin, asyncHandler(createCategory));
router.put('/:id', authenticate, requireAdmin, asyncHandler(updateCategory));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(deleteCategory));

export default router;
