import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubcategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException(`Category ${dto.categoryId} not found`);

    const conflict = await this.prisma.subcategory.findUnique({
      where: { categoryId_slug: { categoryId: dto.categoryId, slug: dto.slug } },
    });
    if (conflict) throw new ConflictException(`Slug '${dto.slug}' already exists in this category`);

    return this.prisma.subcategory.create({
      data: dto,
      include: { category: true },
    });
  }

  findAll(categoryId?: string) {
    return this.prisma.subcategory.findMany({
      where: {
        active: true,
        ...(categoryId ? { categoryId } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        category: true,
        _count: { select: { products: true } },
      },
    });
  }

  async findOne(id: string) {
    const sub = await this.prisma.subcategory.findUnique({
      where: { id },
      include: { category: true, _count: { select: { products: true } } },
    });
    if (!sub) throw new NotFoundException(`Subcategory ${id} not found`);
    return sub;
  }

  async findByCategory(categoryId: string) {
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new NotFoundException(`Category ${categoryId} not found`);
    return this.prisma.subcategory.findMany({
      where: { categoryId, active: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { products: true } } },
    });
  }

  async update(id: string, dto: UpdateSubcategoryDto) {
    const sub = await this.findOne(id);
    if (dto.slug) {
      const catId = dto.categoryId ?? sub.categoryId;
      const conflict = await this.prisma.subcategory.findFirst({
        where: { categoryId: catId, slug: dto.slug, NOT: { id } },
      });
      if (conflict) throw new ConflictException(`Slug '${dto.slug}' already exists in this category`);
    }
    return this.prisma.subcategory.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.subcategory.delete({ where: { id } });
  }
}
