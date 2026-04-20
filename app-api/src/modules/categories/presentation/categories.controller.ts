import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { CreateCategoryUseCase } from '../application/use-cases/create-category.use-case';
import { FindCategoriesUseCase } from '../application/use-cases/find-categories.use-case';
import { FindCategoryUseCase } from '../application/use-cases/find-category.use-case';
import { UpdateCategoryUseCase } from '../application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../application/use-cases/delete-category.use-case';
import { CreateCategoryDto } from '../application/dtos/create-category.dto';
import { UpdateCategoryDto } from '../application/dtos/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategory: CreateCategoryUseCase,
    private readonly findCategories: FindCategoriesUseCase,
    private readonly findCategory: FindCategoryUseCase,
    private readonly updateCategory: UpdateCategoryUseCase,
    private readonly deleteCategory: DeleteCategoryUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.createCategory.execute(dto);
  }

  @Get()
  findAll(@Query('include') include?: string) {
    return this.findCategories.execute(include === 'subcategories');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findCategory.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.updateCategory.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteCategory.execute(id);
  }
}
