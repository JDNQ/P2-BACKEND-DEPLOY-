import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";
import { DiscountType } from "./voucher.dto";

export class UpdateVoucherDto {
  @ApiPropertyOptional({ example: "SUMMER20" })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: "Giảm 20% cho đơn từ 500k" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: DiscountType, example: DiscountType.PERCENT })
  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  discountValue?: number;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minOrderValue?: number;

  @ApiPropertyOptional({ example: 200000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  maxDiscount?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  usageLimit?: number;

  @ApiPropertyOptional({ example: "2026-12-31T00:00:00.000Z" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiresAt?: Date;
}
