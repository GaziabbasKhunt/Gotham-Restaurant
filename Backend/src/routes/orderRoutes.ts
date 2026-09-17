import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Customer & General Auth Routes
router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/cancel', authenticate, cancelOrder);

// Admin Routes
router.get('/', authenticate, authorize('admin'), getAllOrders);
router.put('/:id/status', authenticate, authorize('admin'), updateOrderStatus);

export default router;
