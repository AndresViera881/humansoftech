import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found.exception';

@Injectable()
export class FindCategoryUseCase {
  constructor(private readonly repo: CategoryRepository) {}

  async execute(id: string): Promise<any> {
    const category = await this.repo.findById(id);
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }
}
