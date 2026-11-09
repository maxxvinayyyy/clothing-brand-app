import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

function generateTokens(userId: string, email: string, role: string) {
  const accessToken = jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET as string,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { id: userId, email, role },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
}

export const register = async (req: Request, res: Response): Promise<void> => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  const { name, email, password } = result.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: 'Email already registered' });
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

  res.status(201).json({ user, accessToken, refreshToken });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
    accessToken,
    refreshToken,
  });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh token required' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as {
      id: string;
      email: string;
      role: string;
    };

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const tokens = generateTokens(user.id, user.email, user.role);
    res.json(tokens);
  } catch {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Logged out successfully' });
};
