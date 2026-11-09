import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const { category, minPrice, maxPrice, search, featured, sort, page = '1', limit = '12' } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = {};

  if (category) {
    where.category = { slug: category as string };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice as string);
    if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice as string);
  }

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  if (featured === 'true') {
    where.featured = true;
  }

  let orderBy: Record<string, string> = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'name_asc') orderBy = { name: 'asc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      include: {
        category: true,
        images: true,
        reviews: { select: { rating: true } },
        variants: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  const productsWithRating = products.map((p) => ({
    ...p,
    averageRating: p.reviews.length > 0
      ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
      : 0,
    reviewCount: p.reviews.length,
  }));

  res.json({
    products: productsWithRating,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  let product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
      variants: true,
      reviews: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    product = await prisma.product.findUnique({
      where: { id: slug },
      include: {
        category: true,
        images: true,
        variants: true,
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  res.json({ ...product, averageRating, reviewCount: product.reviews.length });
};

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  categoryId: z.string(),
  featured: z.boolean().optional(),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().optional() })).optional(),
  variants: z.array(z.object({ size: z.string(), color: z.string(), stock: z.number().int().min(0) })).optional(),
});

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const result = productSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  const { images, variants, ...rest } = result.data;

  const product = await prisma.product.create({
    data: {
      ...rest,
      images: images ? { create: images } : undefined,
      variants: variants ? { create: variants } : undefined,
    },
    include: { category: true, images: true, variants: true },
  });

  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const { images, variants, ...rest } = req.body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...rest,
      ...(images && {
        images: {
          deleteMany: {},
          create: images,
        },
      }),
      ...(variants && {
        variants: {
          deleteMany: {},
          create: variants,
        },
      }),
    },
    include: { category: true, images: true, variants: true },
  });

  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  await prisma.product.delete({ where: { id } });
  res.json({ message: 'Product deleted successfully' });
};
