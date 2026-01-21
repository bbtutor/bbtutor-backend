import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../errors/customError';
import lessonModel from '../models/lessonModel';
import { AuthRequest } from '../interfaces/userInterface';

// create a lesson
const createLesson = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check authentication first
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    // get the lesson data from the request body
    const {
      title,
      description,
      price,
      category,
      mediaUrl,
      paymentLink,
      tag,
      lessonsCovered,
    } = req.body as {
      title: string;
      description: string;
      price: number;
      category?: string[];
      mediaUrl: string;
      paymentLink: string;
      tag: string;
      lessonsCovered: string[];
    };

    // check if the lesson data is valid
    if (
      !paymentLink ||
      !lessonsCovered ||
      !tag ||
      !mediaUrl ||
      !title ||
      !description ||
      price === undefined ||
      price === null
    ) {
      throw new BadRequestError('Missing required fields');
    }

    if (price < 0) {
      throw new BadRequestError('Price cannot be negative');
    }

    // create the lesson
    const lesson = await lessonModel.create({
      paymentLink,
      mediaUrl,
      title,
      description,
      price,
      category,
      instructor: req.user._id,
      tag,
      lessonsCovered,
    });

    res.status(201).json({
      success: true,
      data: {
        id: lesson._id,
        title: lesson.title,
        description: lesson.description,
        price: lesson.price,
        category: lesson.category,
        instructor: lesson.instructor,
        createdAt: lesson.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// get all lessons
const getAllLessons = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit as string) || 10)
    );
    const skip = (page - 1) * limit;

    const [lessons, total] = await Promise.all([
      lessonModel
        .find()
        .populate('instructor', 'name email role')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      lessonModel.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: lessons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// get lesson by id
const getLessonById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      throw new BadRequestError('Invalid lesson ID format');
    }

    const lesson = await lessonModel
      .findById(id)
      .populate('instructor', 'name email role');

    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

// Update a lesson
const updateLesson = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      throw new BadRequestError('Invalid lesson ID format');
    }

    // Find the lesson
    const lesson = await lessonModel.findById(id);

    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    // Check if user is the instructor or admin
    if (
      lesson.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new UnauthorizedError('Not authorized to update this lesson');
    }

    // Update lesson
    const updatedLesson = await lessonModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedLesson) {
      throw new NotFoundError('Lesson not found');
    }

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: updatedLesson,
    });
  } catch (error) {
    next(error);
  }
};

// delete a lesson
const deleteLesson = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      throw new BadRequestError('Invalid lesson ID format');
    }

    // Find the lesson
    const lesson = await lessonModel.findById(id);

    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    // Check if user is the instructor or admin
    if (
      lesson.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new UnauthorizedError('Not authorized to delete this lesson');
    }

    await lessonModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
};
