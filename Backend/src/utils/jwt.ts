import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../models/User';

export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const secret: Secret = env.JWT_SECRET;
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
  };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  const secret: Secret = env.JWT_SECRET;
  return jwt.verify(token, secret) as JwtPayload;
};
