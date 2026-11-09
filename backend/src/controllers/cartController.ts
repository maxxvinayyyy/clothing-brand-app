import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;

  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
            variant: true,
          },
        },
      },
    });
  }

  res.json(cart);
};

const addItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().int().positive(),
});

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const result = addItemSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  const { productId, variantId, quantity } = result.data;

  // Verify product and variant exist
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant || variant.productId !== productId) {
    res.status(404).json({ message: 'Product or variant not found' });
    return;
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Check if item already in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, variantId, quantity },
    });
  }

  const updatedCart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
    },
  });

  res.json(updatedCart);
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400).json({ message: 'Quantity must be at least 1' });
    return;
  }

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    res.status(404).json({ message: 'Cart not found' });
    return;
  }

  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
  if (!item) {
    res.status(404).json({ message: 'Cart item not found' });
    return;
  }

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });

  const updatedCart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
    },
  });

  res.json(updatedCart);
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { itemId } = req.params;

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    res.status(404).json({ message: 'Cart not found' });
    return;
  }

  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
  if (!item) {
    res.status(404).json({ message: 'Cart item not found' });
    return;
  }

  await prisma.cartItem.delete({ where: { id: itemId } });

  const updatedCart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
    },
  });

  res.json(updatedCart);
};
