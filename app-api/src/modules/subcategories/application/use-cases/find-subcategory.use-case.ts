import { Injectable } from '@nestjs/common';
import { SubcategoryRepository } from '../../domain/repositories/subcategory.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found.exception';

@Injectable()
export class FindSubcategoryUseCase {
  constructor(private readonly repo: SubcategoryRepository) {}

  async execute(id: string): Promise<any> {
    const sub = await this.repo.findById(id);
    if (!sub) throw new NotFoundException(`Subcategory ${id} not found`);
    return sub;
  }
}
