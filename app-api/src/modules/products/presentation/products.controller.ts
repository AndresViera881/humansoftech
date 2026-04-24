import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { FindProductsUseCase } from '../application/use-cases/find-products.use-case';
import { FindProductUseCase } from '../application/use-cases/find-product.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../application/use-cases/delete-product.use-case';
import { CreateProductDto } from '../application/dtos/create-product.dto';
import { UpdateProductDto } from '../application/dtos/update-product.dto';
import { QueryProductDto } from '../application/dtos/query-product.dto';
import { Public } from '../../../shared/auth/decorators/public.decorator';
import { Permissions } from '../../../shared/auth/decorators/permissions.decorator';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly findProducts: FindProductsUseCase,
    private readonly findProduct: FindProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly deleteProduct: DeleteProductUseCase,
  ) {}

  @Permissions('products:write')
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.createProduct.execute(dto);
  }

  @Public()
  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.findProducts.execute(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findProduct.execute(id);
  }

  @Permissions('products:write')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.updateProduct.execute(id, dto);
  }

  @Permissions('products:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteProduct.execute(id);
  }
}
