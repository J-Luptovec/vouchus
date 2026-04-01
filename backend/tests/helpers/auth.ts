import jwt from 'jsonwebtoken';
import { TEST_JWT_SECRET } from './constants';

export function signToken(userId: string, username: string, email = 'julko@vouchus.com'): string {
  return jwt.sign({ userId, username, email }, TEST_JWT_SECRET, { expiresIn: '1h' });
}

export function authHeader(userId: string, username: string, email?: string) {
  return { Authorization: `Bearer ${signToken(userId, username, email)}` };
}
