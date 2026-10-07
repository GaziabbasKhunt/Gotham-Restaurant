import { Router } from 'express';
import { getSettings, updateSettings, getDashboardStats } from '../controllers/settingsController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/dashboard', authenticate, authorize('admin'), getDashboardStats);
router.get('/', getSettings);
router.put('/', authenticate, authorize('admin'), updateSettings);

export default router;
