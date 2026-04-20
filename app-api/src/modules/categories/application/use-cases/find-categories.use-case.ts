import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class FindCategoriesUseCase {
  constructor(private readonly repo: CategoryRepository) {}

  async execute(includeSubcategories = false): Promise<any[]> {
    return this.repo.findAll(includeSubcategories);
  }
}
