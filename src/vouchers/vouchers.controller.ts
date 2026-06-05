import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
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
import { ApplyVoucherDto, CreateVoucherDto } from "./dto/voucher.dto";
import { VouchersService } from "./vouchers.service";

@ApiTags("vouchers")
@Controller("vouchers")
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get()
  @ApiOperation({ summary: "List active vouchers" })
  @ApiResponse({ status: 200, description: "Return vouchers" })
  findAll() {
    return this.vouchersService.findAll();
  }

  @Get(":code")
  @ApiOperation({ summary: "Get voucher by code" })
  @ApiParam({ name: "code", example: "SUMMER10" })
  @ApiResponse({ status: 200, description: "Return voucher or null" })
  findOne(@Param("code") code: string) {
    return this.vouchersService.findOne(code);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create voucher (ADMIN only)" })
  @ApiBody({ type: CreateVoucherDto })
  @ApiResponse({ status: 201, description: "Create voucher" })
  create(@Body() dto: CreateVoucherDto) {
    return this.vouchersService.create(dto);
  }

  @Post("apply")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Apply voucher to an order total" })
  @ApiBody({ type: ApplyVoucherDto })
  @ApiResponse({ status: 200, description: "Return discount and final price" })
  apply(@Body() dto: ApplyVoucherDto) {
    return this.vouchersService.applyVoucher(dto);
  }

  @Patch(":id/deactivate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Deactivate voucher (ADMIN only)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Voucher deactivated" })
  deactivate(@Param("id", ParseIntPipe) id: number) {
    return this.vouchersService.deactivate(id);
  }
}
