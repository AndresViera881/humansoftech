import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { ConflictException } from '../../../../shared/domain/exceptions/conflict.exception';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    private readonly repo: CategoryRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: CreateCategoryDto): Promise<any> {
    const existing = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug '${dto.slug}' already exists`);
    return this.repo.create(dto);
  }
}
