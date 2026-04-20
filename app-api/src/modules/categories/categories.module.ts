import { Module } from '@nestjs/common';
import { CategoryRepository } from './domain/repositories/category.repository';
import { PrismaCategoryRepository } from './infrastructure/repositories/prisma-category.repository';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { FindCategoriesUseCase } from './application/use-cases/find-categories.use-case';
import { FindCategoryUseCase } from './application/use-cases/find-category.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.use-case';
import { CategoriesController } from './presentation/categories.controller';

@Module({
  providers: [
    { provide: CategoryRepository, useClass: PrismaCategoryRepository },
    CreateCategoryUseCase,
    FindCategoriesUseCase,
    FindCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
