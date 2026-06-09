import {
  Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe,
  Post, Req, UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AddWishlistDto } from "./dto/wishlist.dto";
import { WishlistService } from "./wishlist.service";

@ApiTags("wishlist")
@Controller("wishlist")
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: "Get my wishlist" })
  findAll(@Req() req: any) {
    return this.wishlistService.findAll(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: "Add product to wishlist" })
  @ApiBody({ type: AddWishlistDto })
  add(@Req() req: any, @Body() dto: AddWishlistDto) {
    return this.wishlistService.add(req.user.id, dto.productId);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "Remove from wishlist" })
  @ApiParam({ name: "id", type: Number })
  remove(@Req() req: any, @Param("id", ParseIntPipe) id: number) {
    return this.wishlistService.remove(req.user.id, id);
  }

  @Post("add-all-to-cart")
  @HttpCode(200)
  @ApiOperation({ summary: "Add all wishlist items to cart" })
  addAllToCart(@Req() req: any) {
    return this.wishlistService.addAllToCart(req.user.id);
  }
}
