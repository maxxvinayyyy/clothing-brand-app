import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const wishlist = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          images: true,
          category: true,
          reviews: { select: { rating: true } },
        },
      },
    },
  });

  const withRatings = wishlist.map((w) => ({
    ...w,
    product: {
      ...w.product,
      averageRating: w.product.reviews.length > 0
        ? w.product.reviews.reduce((s, r) => s + r.rating, 0) / w.product.reviews.length
        : 0,
    },
  }));

  res.json(withRatings);
};

export const addToWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { productId } = req.body;

  if (!productId) {
    res.status(400).json({ message: 'productId is required' });
    return;
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const existing = await prisma.wishlist.findFirst({ where: { userId, productId } });
  if (existing) {
    res.status(409).json({ message: 'Product already in wishlist' });
    return;
  }

  const item = await prisma.wishlist.create({
    data: { userId, productId },
    include: { product: { include: { images: true, category: true } } },
  });

  res.status(201).json(item);
};

export const removeFromWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { productId } = req.params;

  const existing = await prisma.wishlist.findFirst({ where: { userId, productId } });
  if (!existing) {
    res.status(404).json({ message: 'Product not in wishlist' });
    return;
  }

  await prisma.wishlist.delete({ where: { id: existing.id } });
  res.json({ message: 'Removed from wishlist' });
};
