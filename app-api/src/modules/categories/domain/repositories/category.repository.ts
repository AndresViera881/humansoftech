import { CategoryEntity } from '../entities/category.entity';
import { CreateCategoryDto } from '../../application/dtos/create-category.dto';
import { UpdateCategoryDto } from '../../application/dtos/update-category.dto';

export abstract class CategoryRepository {
  abstract findAll(includeSubcategories: boolean): Promise<any[]>;
  abstract findById(id: string): Promise<CategoryEntity | null>;
  abstract create(data: CreateCategoryDto): Promise<any>;
  abstract update(id: string, data: UpdateCategoryDto): Promise<any>;
  abstract delete(id: string): Promise<void>;
}
