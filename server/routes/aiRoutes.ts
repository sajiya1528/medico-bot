import { Router } from 'express';
import { chat, symptomChecker } from '../controllers/aiController';

const router = Router();

router.post('/chat', chat);
router.post('/symptoms', symptomChecker);

export default router;
