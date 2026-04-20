import { Injectable } from '@nestjs/common';
import { SubcategoryRepository } from '../../domain/repositories/subcategory.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found.exception';

@Injectable()
export class DeleteSubcategoryUseCase {
  constructor(private readonly repo: SubcategoryRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException(`Subcategory ${id} not found`);
    await this.repo.delete(id);
  }
}
