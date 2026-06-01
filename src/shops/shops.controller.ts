import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Role } from "../auth/role.enum";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { CreateShopDto } from "./dto/create-shop.dto";
import { ShopsService } from "./shops.service";

@Controller("shops")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.shopsService.findAll();
  }

  @Get("my")
  @Roles(Role.MANAGER)
  findMine(@Request() request: any) {
    return this.shopsService.findByOwner(request.user.id);
  }

  @Post()
  @HttpCode(201)
  @Roles(Role.MANAGER)
  create(@Body() createShopDto: CreateShopDto, @Request() request: any) {
    return this.shopsService.create(createShopDto, request.user.id);
  }
}
