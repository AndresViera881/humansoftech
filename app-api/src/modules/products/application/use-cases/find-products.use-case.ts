import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { QueryProductDto } from '../dtos/query-product.dto';

@Injectable()
export class FindProductsUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(query: QueryProductDto): Promise<any> {
    return this.repo.findAll(query);
  }
}
