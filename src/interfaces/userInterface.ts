import { Document } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}
