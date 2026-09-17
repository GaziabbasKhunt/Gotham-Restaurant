import { Router } from 'express';
import {
  createReview,
  getMenuItemReviews,
  moderateReview,
  deleteReview,
  getAllReviews
} from '../controllers/reviewController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router({ mergeParams: true });

router.get('/', authenticate, authorize('admin'), getAllReviews);
router.get('/menu/:menuItemId/reviews', getMenuItemReviews);
router.post('/', authenticate, createReview);
router.put('/:id', authenticate, authorize('admin'), moderateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
