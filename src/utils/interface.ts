import { Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

export default IUser;
