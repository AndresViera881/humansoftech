import { Module } from '@nestjs/common';
import { SubcategoryRepository } from './domain/repositories/subcategory.repository';
import { PrismaSubcategoryRepository } from './infrastructure/repositories/prisma-subcategory.repository';
import { CreateSubcategoryUseCase } from './application/use-cases/create-subcategory.use-case';
import { FindSubcategoriesUseCase } from './application/use-cases/find-subcategories.use-case';
import { FindSubcategoryUseCase } from './application/use-cases/find-subcategory.use-case';
import { UpdateSubcategoryUseCase } from './application/use-cases/update-subcategory.use-case';
import { DeleteSubcategoryUseCase } from './application/use-cases/delete-subcategory.use-case';
import { SubcategoriesController } from './presentation/subcategories.controller';

@Module({
  providers: [
    { provide: SubcategoryRepository, useClass: PrismaSubcategoryRepository },
    CreateSubcategoryUseCase,
    FindSubcategoriesUseCase,
    FindSubcategoryUseCase,
    UpdateSubcategoryUseCase,
    DeleteSubcategoryUseCase,
  ],
  controllers: [SubcategoriesController],
})
export class SubcategoriesModule {}
