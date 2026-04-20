import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found.exception';
import { ConflictException } from '../../../../shared/domain/exceptions/conflict.exception';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly repo: ProductRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<any> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException(`Product ${id} not found`);

    const slug = (dto as { slug?: string }).slug;
    if (slug) {
      const conflict = await this.prisma.product.findFirst({
        where: { slug, NOT: { id } },
      });
      if (conflict) throw new ConflictException(`Slug '${slug}' already exists`);
    }

    return this.repo.update(id, dto);
  }
}
