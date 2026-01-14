import mongoose, { Document } from 'mongoose';

export interface ILesson extends Document {
  mediaUrl: string;
  title: string;
  description: string;
  price: number;
  category?: string[];
  instructor: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
