import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  res.json(reviews);
};

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { productId } = req.params;

  const result = reviewSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const existing = await prisma.review.findFirst({ where: { userId, productId } });
  if (existing) {
    res.status(409).json({ message: 'You have already reviewed this product' });
    return;
  }

  const review = await prisma.review.create({
    data: { userId, productId, ...result.data },
    include: { user: { select: { id: true, name: true } } },
  });

  res.status(201).json(review);
};
