import { NextFunction, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../errors/customError';
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
    const { title, description, price, category, mediaUrl } = req.body as {
      title: string;
      description: string;
      price: number;
      category?: string[];
      mediaUrl: string;
    };

    // check if the lesson data is valid
    if (
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
      mediaUrl,
      title,
      description,
      price,
      category,
      instructor: req.user._id,
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

export { createLesson };
