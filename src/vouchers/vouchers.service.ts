import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ApplyVoucherDto, CreateVoucherDto } from "./dto/voucher.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class VouchersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.voucher.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });
  }

  findOne(code: string) {
    return this.prisma.voucher.findFirst({
      where: { code },
    });
  }

  async create(dto: CreateVoucherDto) {
    // Chỉ ADMIN được đảm bảo bởi guard/controller
    const existing = await this.prisma.voucher.findUnique({
      where: { code: dto.code },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException("Voucher code already exists");
    }

    return this.prisma.voucher.create({
      data: {
        code: dto.code,
        description: dto.description,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        minOrderValue: dto.minOrderValue ?? 0,
        maxDiscount: dto.maxDiscount,
        usageLimit: dto.usageLimit ?? 100,
        expiresAt: dto.expiresAt ?? null,
      },
    });
  }

  async applyVoucher(dto: ApplyVoucherDto) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { code: dto.code },
    });

    if (!voucher) {
      throw new BadRequestException("Voucher not found");
    }

    if (!voucher.isActive) {
      throw new BadRequestException("Voucher is inactive");
    }

    if (voucher.expiresAt && voucher.expiresAt <= new Date()) {
      throw new BadRequestException("Voucher expired");
    }

    if (voucher.usageCount >= voucher.usageLimit) {
      throw new BadRequestException("Voucher usage limit reached");
    }

    const minOrderValue = voucher.minOrderValue ?? 0;
    if (dto.orderTotal < minOrderValue) {
      throw new BadRequestException(
        "Order total does not meet voucher minimum",
      );
    }

    let discountAmount = 0;

    if (voucher.discountType === "PERCENT") {
      discountAmount = (dto.orderTotal * voucher.discountValue) / 100;
      if (voucher.maxDiscount != null) {
        discountAmount = Math.min(discountAmount, voucher.maxDiscount);
      }
    } else {
      discountAmount = voucher.discountValue;
    }

    // Ensure non-negative and not exceeding total
    discountAmount = Math.max(0, Math.min(discountAmount, dto.orderTotal));

    const finalPrice = dto.orderTotal - discountAmount;

    return {
      discount: discountAmount,
      finalPrice,
      voucher: {
        ...voucher,
        usageCount: voucher.usageCount,
      },
    };
  }

  async deactivate(id: number) {
    return this.prisma.voucher.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
