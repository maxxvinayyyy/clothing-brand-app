import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

const createOrderSchema = z.object({
  addressId: z.string().optional(),
  newAddress: z.object({
    name: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
  }).optional(),
});

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const result = createOrderSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true, variant: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    res.status(400).json({ message: 'Cart is empty' });
    return;
  }

  let addressId = result.data.addressId;

  if (!addressId && result.data.newAddress) {
    const newAddr = await prisma.address.create({
      data: { userId, ...result.data.newAddress },
    });
    addressId = newAddr.id;
  }

  if (!addressId) {
    res.status(400).json({ message: 'Address is required' });
    return;
  }

  // Verify address belongs to user
  const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
  if (!address) {
    res.status(404).json({ message: 'Address not found' });
    return;
  }

  const total = cart.items.reduce((sum, item) => {
    return sum + parseFloat(item.product.price.toString()) * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      addressId,
      total,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
      address: true,
    },
  });

  // Clear cart
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  res.status(201).json(order);
};

export const getUserOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(orders);
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { id } = req.params;

  const isAdmin = req.user!.role === 'ADMIN';

  const order = await prisma.order.findFirst({
    where: { id, ...(isAdmin ? {} : { userId }) },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
      address: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  res.json(order);
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ message: 'Invalid status' });
    return;
  }

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
      address: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  res.json(updated);
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  const { page = '1', limit = '20', status } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limitNum,
      include: {
        user: { select: { id: true, name: true, email: true } },
        address: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  res.json({ orders, pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) } });
};
