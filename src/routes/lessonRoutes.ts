import express from 'express';
import {
  createLesson,
  getAllLessons,
  getLessonById,
  deleteLesson,
  updateLesson,
} from '../controllers/lesson';

const router = express.Router();

router.post('/create-lesson', createLesson);
router.get('/get-lessons', getAllLessons);
router.get('/get-lesson/:id', getLessonById);
router.delete('/delete-lesson/:id', deleteLesson);
router.patch('/update-lesson/:id', updateLesson);

export default router;
