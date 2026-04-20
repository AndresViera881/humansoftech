import { Injectable } from '@nestjs/common';
import { SubcategoryRepository } from '../../domain/repositories/subcategory.repository';
import { CreateSubcategoryDto } from '../dtos/create-subcategory.dto';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found.exception';
import { ConflictException } from '../../../../shared/domain/exceptions/conflict.exception';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class CreateSubcategoryUseCase {
  constructor(
    private readonly repo: SubcategoryRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: CreateSubcategoryDto): Promise<any> {
    const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException(`Category ${dto.categoryId} not found`);

    const conflict = await this.prisma.subcategory.findUnique({
      where: { categoryId_slug: { categoryId: dto.categoryId, slug: dto.slug } },
    });
    if (conflict) throw new ConflictException(`Slug '${dto.slug}' already exists in this category`);

    return this.repo.create(dto);
  }
}
