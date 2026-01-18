import { Router } from 'express';
import { getProfile, getAllUsers } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/profile', authenticateToken, getProfile);
router.get('/', authenticateToken, getAllUsers);

export default router;
