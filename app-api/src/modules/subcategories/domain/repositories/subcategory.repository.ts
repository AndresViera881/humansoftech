import { SubcategoryEntity } from '../entities/subcategory.entity';
import { CreateSubcategoryDto } from '../../application/dtos/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../../application/dtos/update-subcategory.dto';

export abstract class SubcategoryRepository {
  abstract findAll(categoryId?: string): Promise<any[]>;
  abstract findById(id: string): Promise<SubcategoryEntity | null>;
  abstract findByCategory(categoryId: string): Promise<any[]>;
  abstract create(data: CreateSubcategoryDto): Promise<any>;
  abstract update(id: string, data: UpdateSubcategoryDto): Promise<any>;
  abstract delete(id: string): Promise<void>;
}
