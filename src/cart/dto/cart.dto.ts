import { IsInt, IsOptional, IsPositive, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AddToCartDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  @IsPositive()
  variantId: number;

  @ApiPropertyOptional({ type: Number, example: 2, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity: number = 1;
}

export class UpdateCartItemDto {
  @ApiProperty({ type: Number, example: 3 })
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
