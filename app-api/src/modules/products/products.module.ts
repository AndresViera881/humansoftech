import { Module } from '@nestjs/common';
import { ProductRepository } from './domain/repositories/product.repository';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { FindProductsUseCase } from './application/use-cases/find-products.use-case';
import { FindProductUseCase } from './application/use-cases/find-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { ProductsController } from './presentation/products.controller';

@Module({
  providers: [
    { provide: ProductRepository, useClass: PrismaProductRepository },
    CreateProductUseCase,
    FindProductsUseCase,
    FindProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
