import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { Role } from "../auth/role.enum";
import { DashboardService } from "./dashboard.service";

@ApiTags("dashboard")
@Controller("dashboard")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("admin")
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Admin dashboard data" })
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get("manager")
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: "Manager dashboard data" })
  getManagerDashboard(@Req() req: any) {
    return this.dashboardService.getManagerDashboard(req.user.id);
  }
}
