import { Router } from 'express';
import { createAppointment, getAppointments, updateAppointment } from '../controllers/appointmentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createAppointment);
router.get('/', authenticateToken, getAppointments);
router.put('/:id', authenticateToken, updateAppointment);

export default router;
