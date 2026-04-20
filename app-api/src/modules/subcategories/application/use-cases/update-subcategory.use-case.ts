import { Injectable } from '@nestjs/common';
import { SubcategoryRepository } from '../../domain/repositories/subcategory.repository';
import { UpdateSubcategoryDto } from '../dtos/update-subcategory.dto';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found.exception';
import { ConflictException } from '../../../../shared/domain/exceptions/conflict.exception';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class UpdateSubcategoryUseCase {
  constructor(
    private readonly repo: SubcategoryRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: string, dto: UpdateSubcategoryDto): Promise<any> {
    const sub = await this.repo.findById(id);
    if (!sub) throw new NotFoundException(`Subcategory ${id} not found`);

    if (dto.slug) {
      const catId = dto.categoryId ?? sub.categoryId;
      const conflict = await this.prisma.subcategory.findFirst({
        where: { categoryId: catId, slug: dto.slug, NOT: { id } },
      });
      if (conflict) throw new ConflictException(`Slug '${dto.slug}' already exists in this category`);
    }

    return this.repo.update(id, dto);
  }
}
