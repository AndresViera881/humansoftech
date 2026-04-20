import { ProductEntity } from '../entities/product.entity';
import { CreateProductDto } from '../../application/dtos/create-product.dto';
import { UpdateProductDto } from '../../application/dtos/update-product.dto';
import { QueryProductDto } from '../../application/dtos/query-product.dto';

export abstract class ProductRepository {
  abstract findAll(query: QueryProductDto): Promise<{
    data: any[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }>;
  abstract findById(id: string): Promise<ProductEntity | null>;
  abstract create(data: CreateProductDto): Promise<any>;
  abstract update(id: string, data: UpdateProductDto): Promise<any>;
  abstract delete(id: string): Promise<void>;
}
