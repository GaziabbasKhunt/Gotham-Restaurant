import { Router } from 'express';
import { getAllUsers, updateUserRole } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);

export default router;
