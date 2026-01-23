import express from 'express';
import { getCurrentUser, login, register } from '../controllers/auth';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current-user', authMiddleware, getCurrentUser);

export default router;
