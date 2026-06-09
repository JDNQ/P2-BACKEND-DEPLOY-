import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: { page?: number; limit?: number; action?: string; userId?: number }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.action) where.action = query.action;
    if (query.userId) where.userId = query.userId;

    return this.prisma.activityLog.findMany({
      where,
      include: { user: { select: { id: true, username: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });
  }

  async getStats() {
    const [totalLogs, actionCounts, recentDays] = await Promise.all([
      this.prisma.activityLog.count(),
      this.prisma.activityLog.groupBy({
        by: ["action"],
        _count: true,
        orderBy: { _count: { action: "desc" } },
      }),
      this.prisma.activityLog.findMany({
        take: 7,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          action: true,
          createdAt: true,
          user: { select: { id: true, username: true } },
        },
      }),
    ]);

    return {
      totalLogs,
      actionBreakdown: actionCounts.map((a) => ({
        action: a.action,
        count: a._count,
      })),
      recentActivity: recentDays,
    };
  }

  async log(params: {
    userId?: number;
    action: string;
    entity?: string;
    entityId?: number;
    details?: string;
    ip?: string;
  }) {
    return this.prisma.activityLog.create({ data: params });
  }
}
