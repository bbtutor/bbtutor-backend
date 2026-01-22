import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/customError';
import { AuthRequest } from '../interfaces/userInterface';
import userModel from '../models/userModel';
import checkEnv from '../utils/checkEnv';

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // Verify token
    const decodedToken = jwt.verify(token, checkEnv('JWT_SECRET')) as {
      id: string;
    };

    // Find user
    const user = await userModel.findById(decodedToken.id).select('-password');

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else {
      next(error);
    }
  }
};

export { authMiddleware };
