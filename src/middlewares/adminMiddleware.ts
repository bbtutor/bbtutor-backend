import { NextFunction, Response } from 'express';
import { AuthRequest } from '../interfaces/userInterface';
import { UnauthorizedError } from '../errors/customError';

const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if user is admin
    if (req.user?.role !== 'admin') {
      throw new UnauthorizedError('Unauthorized');
    }
    next();
  } catch (error) {
    next(error);
  }
};

export { adminMiddleware };
