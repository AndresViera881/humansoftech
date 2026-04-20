import { Injectable } from '@nestjs/common';
import { SubcategoryRepository } from '../../domain/repositories/subcategory.repository';

@Injectable()
export class FindSubcategoriesUseCase {
  constructor(private readonly repo: SubcategoryRepository) {}

  async execute(categoryId?: string): Promise<any[]> {
    return this.repo.findAll(categoryId);
  }
}
