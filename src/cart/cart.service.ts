import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { AddToCartDto, UpdateCartItemDto } from "./dto/cart.dto";

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(userId: number, dto: AddToCartDto) {
    const { productId, variantId, quantity } = dto;

    const variant = await this.prisma.variant.findUnique({
      where: { id: variantId },
      select: { id: true, stock: true, productId: true },
    });

    if (!variant || variant.productId !== productId) {
      throw new BadRequestException("Variant not found for this product");
    }

    if (variant.stock < quantity) {
      throw new BadRequestException("Variant stock not enough");
    }

    const existing = await this.prisma.cartItem.findUnique({
      where: {
        userId_variantId: { userId, variantId },
      },
      include: { variant: true },
    });

    if (existing) {
      const nextQuantity = existing.quantity + quantity;
      if (existing.variant.stock < nextQuantity) {
        throw new BadRequestException("Variant stock not enough");
      }
    }

    return this.prisma.cartItem.upsert({
      where: {
        userId_variantId: { userId, variantId },
      },
      create: {
        userId,
        productId,
        variantId,
        quantity,
      },
      update: {
        quantity: { increment: quantity },
      },
      include: {
        product: { include: { images: true } },
        variant: true,
      },
    });
  }

  async getCart(userId: number) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: true,
          },
        },
        variant: true,
      },
    });

    const totalPrice = items.reduce((sum, item) => {
      const basePrice = item.product.basePrice;
      const extraPrice = item.variant.extraPrice;
      return sum + (basePrice + extraPrice) * item.quantity;
    }, 0);

    return { items, totalPrice };
  }

  async updateCartItem(
    userId: number,
    cartItemId: number,
    dto: UpdateCartItemDto,
  ) {
    const { quantity } = dto;

    const existing = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { variant: true },
    });

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException("Cart item not found");
    }

    if (existing.variant.stock < quantity) {
      throw new BadRequestException("Variant stock not enough");
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: { include: { images: true } },
        variant: true,
      },
    });
  }

  async removeCartItem(userId: number, cartItemId: number) {
    const existing = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: { id: true, userId: true },
    });

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException("Cart item not found");
    }

    await this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async clearCart(userId: number) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
  }
}
