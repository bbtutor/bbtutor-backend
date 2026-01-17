import { IUser } from '../interfaces/userInterface';
import checkEnv from './checkEnv';
import jwt from 'jsonwebtoken';

const generateAccessToken = async (user: IUser) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    checkEnv('JWT_SECRET'),
    {
      expiresIn: '1d',
    }
  );

  return token;
};

export default generateAccessToken;
