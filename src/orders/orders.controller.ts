import {
  Body,
  Controller,
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
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { Role } from "../auth/role.enum";
import { CreateOrderDto, UpdateOrderStatusDto } from "./dto/order.dto";
import { OrdersService } from "./orders.service";

@ApiTags("orders")
@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: "Create an order" })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: "Order created" })
  create(@Req() req: any, @Body() dto: CreateOrderDto) {
    const userId = req.user?.id;
    return this.ordersService.create(userId, dto);
  }

  @Get("my")
  @ApiOperation({ summary: "Get my orders" })
  @ApiResponse({ status: 200, description: "Return orders" })
  findMyOrders(@Req() req: any) {
    const userId = req.user?.id;
    return this.ordersService.findMyOrders(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get order by id (my order only)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Return order" })
  findOne(@Req() req: any, @Param("id", ParseIntPipe) id: number) {
    const userId = req.user?.id;
    return this.ordersService.findOne(id, userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Admin: get all orders" })
  @ApiResponse({ status: 200, description: "Return all orders" })
  findAll() {
    return this.ordersService.findAll();
  }

  @Patch(":id/status")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Admin/Manager: update order status" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({ status: 200, description: "Order status updated" })
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
