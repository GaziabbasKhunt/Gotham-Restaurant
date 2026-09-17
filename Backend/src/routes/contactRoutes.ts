import { Router } from 'express';
import {
  submitContactForm,
  getAllContactMessages,
  updateContactStatus
} from '../controllers/contactController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', submitContactForm);

// Admin Routes
router.get('/', authenticate, authorize('admin'), getAllContactMessages);
router.put('/:id/status', authenticate, authorize('admin'), updateContactStatus);

export default router;
