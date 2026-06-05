import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      include: { variants: true, images: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: true },
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  create(dto: CreateProductDto) {
    const { variants, images, ...productData } = dto;

    return this.prisma.product.create({
      data: {
        ...productData,
        // TODO: connect to Shop via shopId when MANAGER/ADMIN endpoints are implemented.
        shop: { connect: { id: (productData as any).shopId } },
        variants: {
          create: variants.map(({ image, ...v }) => ({ ...v, image })),
        },
        ...(images && images.length > 0 ? { images: { create: images } } : {}),
      },
      include: { variants: true, images: true },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException("At least one field must be provided");
    }

    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    const { variants, images, ...productData } = dto;

    try {
      return await this.prisma.$transaction(async (transaction) => {
        await transaction.variant.deleteMany({
          where: { productId: id },
        });

        return transaction.product.update({
          where: { id },
          data: {
            ...productData,
            ...(variants
              ? {
                  variants: {
                    create: variants.map(({ image, ...v }) => ({
                      ...v,
                      image,
                    })),
                  },
                }
              : {}),
            ...(images
              ? {
                  images: {
                    deleteMany: {},
                    create: images,
                  },
                }
              : {}),
          },
          include: { variants: true, images: true },
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException(`Product #${id} not found`);
      }

      throw error;
    }
  }

  async remove(id: number) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    await this.prisma.product.delete({
      where: { id },
    });
  }
}
