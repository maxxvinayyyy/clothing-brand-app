import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { getAnalytics } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/analytics', asyncHandler(getAnalytics));

export default router;
