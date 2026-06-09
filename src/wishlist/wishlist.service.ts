import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { variants: true, images: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async add(userId: number, productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) throw new NotFoundException("Product not found");

    const existing = await this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) throw new ConflictException("Product already in wishlist");

    return this.prisma.wishlist.create({
      data: { userId, productId },
      include: {
        product: {
          include: { variants: true, images: true },
        },
      },
    });
  }

  async remove(userId: number, id: number) {
    const item = await this.prisma.wishlist.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException("Wishlist item not found");
    await this.prisma.wishlist.delete({ where: { id } });
  }

  async addAllToCart(userId: number) {
    const items = await this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { variants: true },
        },
      },
    });

    for (const item of items) {
      const firstVariant = item.product.variants[0];
      if (!firstVariant || firstVariant.stock < 1) continue;

      const existing = await this.prisma.cartItem.findUnique({
        where: { userId_variantId: { userId, variantId: firstVariant.id } },
      });

      if (existing) {
        await this.prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + 1 },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            userId,
            productId: item.productId,
            variantId: firstVariant.id,
            quantity: 1,
          },
        });
      }
    }

    return { added: items.length };
  }
}
