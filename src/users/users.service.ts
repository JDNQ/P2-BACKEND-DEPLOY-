import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto, UpdateUserRoleDto, ToggleUserStatusDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { id: "asc" },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) throw new NotFoundException(`User #${id} not found`);

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        avatarUrl: true,
      },
    });
  }

  async updateRole(id: number, dto: UpdateUserRoleDto) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) throw new NotFoundException(`User #${id} not found`);

    return this.prisma.user.update({
      where: { id },
      data: { role: dto.role as any },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
      },
    });
  }

  async toggleStatus(id: number, dto: ToggleUserStatusDto) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) throw new NotFoundException(`User #${id} not found`);

    return this.prisma.user.update({
      where: { id },
      data: { status: dto.status },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
      },
    });
  }

  async remove(id: number) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingUser) {
      throw new NotFoundException(`User #${id} not found`);
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
