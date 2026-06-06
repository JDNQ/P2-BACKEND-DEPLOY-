import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateVariantDto {
  @ApiProperty()
  @IsString()
  variantName: string;

  @ApiProperty({ default: 0 })
  @Type(() => Number)
  @IsNumber()
  extraPrice: number;

  @ApiProperty({ default: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    required: false,
    description: "URL ảnh variant (upload trước rồi điền url)",
  })
  @IsOptional()
  @IsString()
  image?: string;
}

export class ProductImageDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  productName: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  shopId?: number;

  @ApiProperty({ type: [CreateVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];

  @ApiProperty({
    type: [ProductImageDto],
    required: false,
    description: "List URL ảnh product (upload trước rồi điền url)",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];
}
