import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found.exception';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException(`Product ${id} not found`);
    await this.repo.delete(id);
  }
}
