import { prisma } from "../prisma";
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export const authService = {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] },
    });
    if (existing) {
      const field = existing.email === data.email ? 'email' : 'username';
      const err = new Error(`That ${field} is already taken`) as Error & { status: number };
      err.status = 409;
      throw err;
    }

    const hashed = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { email: data.email, username: data.username, password: hashed },
      select: { id: true, email: true, username: true },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as SignOptions
    );

    return { token, user };
  },

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      const err = new Error('Invalid credentials') as Error & { status: number };
      err.status = 401;
      throw err;
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      const err = new Error('Invalid credentials') as Error & { status: number };
      err.status = 401;
      throw err;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as SignOptions
    );

    return { token, user: { id: user.id, email: user.email, username: user.username } };
  },
};
