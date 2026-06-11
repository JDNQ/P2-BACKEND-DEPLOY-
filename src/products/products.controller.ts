import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products with variants.' })
  async findAll() {
    try {
      return await this.productsService.findAll();
    } catch (e: any) {
      throw new InternalServerErrorException({
        message: e?.message || 'Unknown error',
        code: e?.code,
        meta: e?.meta,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({ status: 200, description: 'Return one product with variants.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a product (Admin/Manager)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Create a new product with variants.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update a product (Admin/Manager)' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Update a product with variants.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a product (Admin/Manager)' })
  @ApiResponse({ status: 204, description: 'Delete a product.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
  }

  @Patch(':id/visibility')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Toggle product visibility (Admin/Manager)' })
  @ApiBody({ schema: { type: 'object', properties: { visible: { type: 'boolean' } } } })
  @ApiResponse({ status: 200, description: 'Product visibility updated.' })
  async toggleVisibility(
    @Param('id', ParseIntPipe) id: number,
    @Body('visible') visible: boolean,
  ) {
    return this.productsService.toggleVisibility(id, visible);
  }
}
