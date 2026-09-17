import { Router } from 'express';
import {
  createReservation,
  getMyReservations,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  cancelReservation
} from '../controllers/reservationController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Customer Routes
router.post('/', authenticate, createReservation);
router.get('/my-reservations', authenticate, getMyReservations);
router.get('/:id', authenticate, getReservationById);
router.delete('/:id', authenticate, cancelReservation);

// Admin Routes
router.get('/', authenticate, authorize('admin'), getAllReservations);
router.put('/:id/status', authenticate, authorize('admin'), updateReservationStatus);

export default router;
