import UserModel from '../models/userModel';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../errors/customError';
import generateAccessToken from '../utils/genAccessToken';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../interfaces/userInterface';

// Register/Signup a User
const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: string;
    };

    // Validate required fields
    if (!name || !email || !password) {
      throw new BadRequestError('Please provide all necessary fields');
    }

    // Check if user already exists
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      throw new BadRequestError('User already exists');
    }

    // Hash the password - CORRECT WAY
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    // Generate token
    const accessToken = await generateAccessToken(user);

    // Set cookie with security options
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login a User
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    // Validate required fields
    if (!email || !password) {
      throw new BadRequestError('Please provide email and password');
    }

    // Find user and explicitly select password
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate token
    const accessToken = await generateAccessToken(user);

    // Set cookie with security options
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.user is set by authenticate middleware
    const user = await UserModel.findById(req.user?._id).select('-password');

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { register, login, getCurrentUser };
