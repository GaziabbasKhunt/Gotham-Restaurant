import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin Restricted Routes
router.post('/', authenticate, authorize('admin'), createCategory);
router.put('/:id', authenticate, authorize('admin'), updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

export default router;
