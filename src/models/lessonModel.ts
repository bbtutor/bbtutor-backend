import mongoose from 'mongoose';
import { ILesson } from '../interfaces/lessonInterface';

const lessonSchema = new mongoose.Schema<ILesson>(
  {
    mediaUrl: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: [String],
    },
    paymentLink: {
      type: String,
      trim: true,
      required: true,
    },
    tag: {
      type: String,
      trim: true,
      required: true,
    },
    lessonsCovered: {
      type: [String],
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILesson>('Lesson', lessonSchema);
