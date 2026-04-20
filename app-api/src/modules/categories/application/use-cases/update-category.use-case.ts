import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found.exception';
import { ConflictException } from '../../../../shared/domain/exceptions/conflict.exception';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    private readonly repo: CategoryRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: string, dto: UpdateCategoryDto): Promise<any> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException(`Category ${id} not found`);

    if (dto.slug) {
      const conflict = await this.prisma.category.findFirst({
        where: { slug: dto.slug, NOT: { id } },
      });
      if (conflict) throw new ConflictException(`Slug '${dto.slug}' already exists`);
    }

    return this.repo.update(id, dto);
  }
}
