import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticate, authorize('admin'), updateSettings);

export default router;
