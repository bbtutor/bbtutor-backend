import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/authRoutes';
import errorHandler from './errors/errorHandler';
import connectDB from './config/db';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
