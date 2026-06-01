import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateShopDto } from "./dto/create-shop.dto";

@Injectable()
export class ShopsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.shop.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  findByOwner(ownerId: number) {
    return this.prisma.shop.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
    });
  }

  create(dto: CreateShopDto, ownerId: number) {
    return this.prisma.shop.create({
      data: {
        shopName: dto.shopName,
        description: dto.description,
        owner: { connect: { id: ownerId } },
      },
    });
  }
}
