import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { Role } from "../auth/role.enum";
import { LogsService } from "./logs.service";

@ApiTags("logs")
@Controller("logs")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MANAGER)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  @ApiOperation({ summary: "Get activity logs (Manager only)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "action", required: false, type: String })
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("action") action?: string,
  ) {
    return this.logsService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      action,
    });
  }

  @Get("stats")
  @ApiOperation({ summary: "Get log statistics" })
  getStats() {
    return this.logsService.getStats();
  }
}
