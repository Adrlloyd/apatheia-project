import jwt from 'jsonwebtoken';
import { config } from '../config';

interface Payload {
  userId: string | number;
  name: string;
}

export function generateToken(payload: Payload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '30m',
  });
}