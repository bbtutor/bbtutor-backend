import checkEnv from './checkEnv';
import IUser from './interface';
import jwt from 'jsonwebtoken';

const JWT_SECRET = checkEnv(process.env.JWT_SECRET as string);

const generateAccessToken = async (user: IUser) => {
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: '1d',
  });

  return token;
};

export default generateAccessToken;
