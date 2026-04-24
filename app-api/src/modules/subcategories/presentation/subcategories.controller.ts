import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { CreateSubcategoryUseCase } from '../application/use-cases/create-subcategory.use-case';
import { FindSubcategoriesUseCase } from '../application/use-cases/find-subcategories.use-case';
import { FindSubcategoryUseCase } from '../application/use-cases/find-subcategory.use-case';
import { UpdateSubcategoryUseCase } from '../application/use-cases/update-subcategory.use-case';
import { DeleteSubcategoryUseCase } from '../application/use-cases/delete-subcategory.use-case';
import { CreateSubcategoryDto } from '../application/dtos/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../application/dtos/update-subcategory.dto';
import { Public } from '../../../shared/auth/decorators/public.decorator';
import { Permissions } from '../../../shared/auth/decorators/permissions.decorator';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(
    private readonly createSubcategory: CreateSubcategoryUseCase,
    private readonly findSubcategories: FindSubcategoriesUseCase,
    private readonly findSubcategory: FindSubcategoryUseCase,
    private readonly updateSubcategory: UpdateSubcategoryUseCase,
    private readonly deleteSubcategory: DeleteSubcategoryUseCase,
  ) {}

  @Permissions('categories:write')
  @Post()
  create(@Body() dto: CreateSubcategoryDto) {
    return this.createSubcategory.execute(dto);
  }

  @Public()
  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.findSubcategories.execute(categoryId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findSubcategory.execute(id);
  }

  @Permissions('categories:write')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubcategoryDto) {
    return this.updateSubcategory.execute(id, dto);
  }

  @Permissions('categories:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteSubcategory.execute(id);
  }
}
