import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Role } from "../auth/role.enum";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { UpdateUserDto, UpdateUserRoleDto, ToggleUserStatusDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Get all users" })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by id" })
  @ApiParam({ name: "id", type: Number })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user profile" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ type: UpdateUserDto })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(":id/role")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update user role (Admin only)" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ type: UpdateUserRoleDto })
  updateRole(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateUserRoleDto) {
    return this.usersService.updateRole(id, dto);
  }

  @Patch(":id/toggle-status")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Toggle user status (Admin only)" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ type: ToggleUserStatusDto })
  toggleStatus(@Param("id", ParseIntPipe) id: number, @Body() dto: ToggleUserStatusDto) {
    return this.usersService.toggleStatus(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "Delete user" })
  @ApiParam({ name: "id", type: Number })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.usersService.remove(id);
  }
}
