import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AddToCartDto, UpdateCartItemDto } from "./dto/cart.dto";
import { CartService } from "./cart.service";

@ApiTags("cart")
@Controller("cart")
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Get my cart" })
  @ApiResponse({
    status: 200,
    description: "Return cart items and total price.",
  })
  getCart(@Req() req: any) {
    const userId = req.user?.id;
    return this.cartService.getCart(userId);
  }

  @Post()
  @ApiOperation({ summary: "Add item to my cart" })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({ status: 201, description: "Add or update cart item." })
  addToCart(@Req() req: any, @Body() dto: AddToCartDto) {
    const userId = req.user?.id;
    return this.cartService.addToCart(userId, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update cart item quantity" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({ status: 200, description: "Update cart item." })
  updateCartItem(
    @Req() req: any,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    const userId = req.user?.id;
    return this.cartService.updateCartItem(userId, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove cart item" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 204, description: "Cart item removed." })
  @ApiResponse({ status: 404, description: "Cart item not found." })
  removeCartItem(@Req() req: any, @Param("id", ParseIntPipe) id: number) {
    const userId = req.user?.id;
    return this.cartService.removeCartItem(userId, id);
  }

  @Delete()
  @ApiOperation({ summary: "Clear my cart" })
  @ApiResponse({ status: 204, description: "Cart cleared." })
  clearCart(@Req() req: any) {
    const userId = req.user?.id;
    return this.cartService.clearCart(userId);
  }
}
