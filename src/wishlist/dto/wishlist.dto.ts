import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive } from "class-validator";

export class AddWishlistDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  productId: number;
}
