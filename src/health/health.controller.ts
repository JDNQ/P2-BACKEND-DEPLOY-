import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../prisma/prisma.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("services")
  @ApiOperation({ summary: "Check service status" })
  async getServices() {
    let dbStatus = "healthy";
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = "unhealthy";
    }

    return {
      database: dbStatus,
      api: "healthy",
      timestamp: new Date().toISOString(),
    };
  }

  @Get("alerts")
  @ApiOperation({ summary: "Get system alerts" })
  async getAlerts() {
    const lowStockCount = await this.prisma.variant.count({
      where: { stock: { lte: 5 } },
    });
    const pendingOrders = await this.prisma.order.count({
      where: { status: "PENDING" },
    });

    const alerts: any[] = [];
    if (lowStockCount > 0) {
      alerts.push({
        type: "warning",
        message: `${lowStockCount} variants have low stock`,
        severity: "medium",
      });
    }
    if (pendingOrders > 10) {
      alerts.push({
        type: "info",
        message: `${pendingOrders} orders pending confirmation`,
        severity: "low",
      });
    }

    return alerts;
  }

  @Get("infrastructure")
  @ApiOperation({ summary: "Get infrastructure info" })
  getInfrastructure() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV ?? "development",
    };
  }
}
