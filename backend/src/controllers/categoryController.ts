import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });
  res.json(categories);
};

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
});

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const result = categorySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  const existing = await prisma.category.findUnique({ where: { slug: result.data.slug } });
  if (existing) {
    res.status(409).json({ message: 'Category with this slug already exists' });
    return;
  }

  const category = await prisma.category.create({ data: result.data });
  res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const result = categorySchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: 'Category not found' });
    return;
  }

  const category = await prisma.category.update({ where: { id }, data: result.data });
  res.json(category);
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const existing = await prisma.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } });
  if (!existing) {
    res.status(404).json({ message: 'Category not found' });
    return;
  }

  if (existing._count.products > 0) {
    res.status(400).json({ message: 'Cannot delete category with existing products' });
    return;
  }

  await prisma.category.delete({ where: { id } });
  res.json({ message: 'Category deleted successfully' });
};
