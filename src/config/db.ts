import mongoose from 'mongoose';
import checkEnv from '../utils/checkEnv';

const connectDB = async (): Promise<void> => {
  try {
    // Validate DATABASE_URL exists before attempting connection
    const dbUrl = checkEnv('DATABASE_URL');

    const conn = await mongoose.connect(dbUrl);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
