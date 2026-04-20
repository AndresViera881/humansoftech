import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ConflictException } from '../../../../shared/domain/exceptions/conflict.exception';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found.exception';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly repo: ProductRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: CreateProductDto): Promise<any> {
    const existing = await this.prisma.product.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug '${dto.slug}' already exists`);

    const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException(`Category ${dto.categoryId} not found`);

    if (dto.subcategoryId) {
      const sub = await this.prisma.subcategory.findUnique({ where: { id: dto.subcategoryId } });
      if (!sub) throw new NotFoundException(`Subcategory ${dto.subcategoryId} not found`);
    }

    return this.repo.create(dto);
  }
}
