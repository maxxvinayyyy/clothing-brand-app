import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAnalytics = async (_req: Request, res: Response): Promise<void> => {
  const [
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
    recentOrders,
    ordersByStatus,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'CANCELLED' } },
    }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
  ]);

  res.json({
    stats: {
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      totalProducts,
      totalUsers,
    },
    recentOrders,
    ordersByStatus,
  });
};
