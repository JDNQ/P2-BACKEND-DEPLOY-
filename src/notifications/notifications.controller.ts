import {
  Controller, Delete, Get, HttpCode, Param, ParseIntPipe,
  Patch, Post, Req, UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { NotificationsService } from "./notifications.service";

@ApiTags("notifications")
@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Get my notifications" })
  findAll(@Req() req: any) {
    return this.notificationsService.findAll(req.user.id);
  }

  @Get("unread-count")
  @ApiOperation({ summary: "Get unread notifications count" })
  unreadCount(@Req() req: any) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "Mark notification as read" })
  @ApiParam({ name: "id", type: Number })
  markRead(@Req() req: any, @Param("id", ParseIntPipe) id: number) {
    return this.notificationsService.markRead(req.user.id, id);
  }

  @Patch("read-all")
  @ApiOperation({ summary: "Mark all notifications as read" })
  markAllRead(@Req() req: any) {
    return this.notificationsService.markAllRead(req.user.id);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "Delete a notification" })
  @ApiParam({ name: "id", type: Number })
  remove(@Req() req: any, @Param("id", ParseIntPipe) id: number) {
    return this.notificationsService.remove(req.user.id, id);
  }
}
