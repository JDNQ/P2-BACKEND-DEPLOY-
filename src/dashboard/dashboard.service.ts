import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminDashboard() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      recentOrders,
      topProductsRaw,
      recentLogs,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.product.count(),
      this.prisma.user.count(),
      this.prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { status: "DELIVERED" },
      }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, username: true } },
          items: true,
        },
      }),
      this.prisma.orderItem.groupBy({
        by: ["productId", "productName"],
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 10,
      }),
      this.prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, username: true } },
        },
      }),
    ]);

    const revenue = await this.prisma.$queryRawUnsafe<
      { date: string; total: number }[]
    >(
      `SELECT DATE(createdAt) as date, SUM(totalPrice) as total
       FROM \`Order\`
       WHERE status = 'DELIVERED' AND createdAt >= ?
       GROUP BY DATE(createdAt)
       ORDER BY date ASC`,
      thirtyDaysAgo,
    );

    const productCountByShop = await this.prisma.product.groupBy({
      by: ["shopId"],
      _count: true,
    });

    return {
      kpis: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue: totalRevenue._sum.totalPrice ?? 0,
        pendingOrders: await this.prisma.order.count({ where: { status: "PENDING" } }),
      },
      revenue: (revenue || []).map((r) => ({
        date: r.date,
        total: Number(r.total),
      })),
      topProducts: topProductsRaw.map((p) => ({
        productId: p.productId,
        productName: p.productName,
        totalSold: p._sum.quantity,
        totalRevenue: p._sum.price,
      })),
      recentActivities: recentLogs.map((l) => ({
        id: l.id,
        action: l.action,
        user: l.user,
        createdAt: l.createdAt,
      })),
      categoryStats: productCountByShop.map((s) => ({
        shopId: s.shopId,
        count: s._count,
      })),
    };
  }

  async getManagerDashboard(managerId: number) {
    const shops = await this.prisma.shop.findMany({
      where: { ownerId: managerId },
      select: { id: true },
    });
    const shopIds = shops.map((s) => s.id);

    const where = shopIds.length > 0 ? { shopId: { in: shopIds } } : { shopId: null };

    const [totalProducts, totalOrders, totalRevenue, recentOrders, topProductsRaw] =
      await Promise.all([
        this.prisma.product.count({ where }),
        this.prisma.order.count(),
        this.prisma.order.aggregate({
          _sum: { totalPrice: true },
          where: { status: "DELIVERED" },
        }),
        this.prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, username: true } },
            items: true,
          },
        }),
        this.prisma.orderItem.groupBy({
          by: ["productId", "productName"],
          _sum: { quantity: true, price: true },
          orderBy: { _sum: { quantity: "desc" } },
          take: 10,
        }),
      ]);

    return {
      kpis: {
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenue._sum.totalPrice ?? 0,
        pendingOrders: await this.prisma.order.count({ where: { status: "PENDING" } }),
      },
      revenue: [], // manager revenue - simplified
      topProducts: topProductsRaw.map((p) => ({
        productId: p.productId,
        productName: p.productName,
        totalSold: p._sum.quantity,
        totalRevenue: p._sum.price,
      })),
      recentActivities: recentOrders.map((o) => ({
        id: o.id,
        action: `Order #${o.id} - ${o.status}`,
        user: o.user,
        createdAt: o.createdAt,
      })),
    };
  }
}
