import express from 'express';
import {
  createLesson,
  getAllLessons,
  getLessonById,
  deleteLesson,
  updateLesson,
} from '../controllers/lesson';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes - anyone can view lessons
router.post('/create-lesson', authMiddleware, adminMiddleware, createLesson);
router.get('/get-lessons', getAllLessons);
router.get('/get-lesson/:id', getLessonById);

// Admin-only routes - create, update, delete
router.delete(
  '/delete-lesson/:id',
  authMiddleware,
  adminMiddleware,
  deleteLesson
);
router.patch(
  '/update-lesson/:id',
  authMiddleware,
  adminMiddleware,
  updateLesson
);

export default router;
