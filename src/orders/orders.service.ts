import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto, UpdateOrderStatusDto } from "./dto/order.dto";
import { VouchersService } from "../vouchers/vouchers.service";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vouchersService: VouchersService,
  ) {}

  async create(userId: number, dto: CreateOrderDto) {
    if (!dto.items?.length) {
      throw new BadRequestException("Order items is required");
    }

    return this.prisma.$transaction(async (transaction) => {
      let subtotal = 0;

      // Validate stock and compute prices
      const orderItemsData = [] as any[];

      for (const item of dto.items) {
        const variant = await transaction.variant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant || variant.productId !== item.productId) {
          throw new BadRequestException("Invalid product/variant");
        }

        if (variant.stock < item.quantity) {
          throw new BadRequestException("Variant stock not enough");
        }

        const priceEach = variant.product.basePrice + variant.extraPrice;
        subtotal += priceEach * item.quantity;

        orderItemsData.push({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: priceEach,
          productName: variant.product.productName,
          variantName: variant.variantName,
        });
      }

      let discountAmount = 0;

      if (dto.voucherCode) {
        const applied = await this.vouchersService.applyVoucher({
          code: dto.voucherCode,
          orderTotal: subtotal,
        });
        discountAmount = applied.discountAmount;
      }

      // Increase voucher usedCount if applied
      if (dto.voucherCode) {
        await transaction.voucher.update({
          where: { code: dto.voucherCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      const totalPrice = subtotal - discountAmount;

      // Decrease stock
      for (const item of dto.items) {
        await transaction.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const order = await transaction.order.create({
        data: {
          userId,
          totalPrice,
          status: "PENDING",
          note: dto.note,
          voucherCode: dto.voucherCode ?? null,
          discountAmount,
          items: {
            create: orderItemsData.map((it) => ({
              productId: it.productId,
              variantId: it.variantId,
              quantity: it.quantity,
              price: it.price,
              productName: it.productName,
              variantName: it.variantName,
            })),
          },
        },
        include: { items: true },
      });

      // Clear cart items corresponding
      const variantIds = dto.items.map((i) => i.variantId);
      await transaction.cartItem.deleteMany({
        where: {
          userId,
          variantId: { in: variantIds },
        },
      });

      return transaction.order.findUnique({
        where: { id: order.id },
        include: { items: true },
      });
    });
  }

  findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }

  findOne(id: number, userId: number) {
    return this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: true },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: { user: true, items: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const existing = await this.prisma.order.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Order not found");

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: { items: true },
    });
  }
}
