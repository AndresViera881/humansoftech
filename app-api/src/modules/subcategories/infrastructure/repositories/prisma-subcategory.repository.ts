import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { SubcategoryRepository } from '../../domain/repositories/subcategory.repository';
import { SubcategoryEntity } from '../../domain/entities/subcategory.entity';
import { SubcategoryMapper } from '../mappers/subcategory.mapper';
import { CreateSubcategoryDto } from '../../application/dtos/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../../application/dtos/update-subcategory.dto';

@Injectable()
export class PrismaSubcategoryRepository implements SubcategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(categoryId?: string): Promise<any[]> {
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

  async findById(id: string): Promise<SubcategoryEntity | null> {
    const sub = await this.prisma.subcategory.findUnique({
      where: { id },
      include: { category: true, _count: { select: { products: true } } },
    });
    if (!sub) return null;
    return SubcategoryMapper.toDomain(sub);
  }

  async findByCategory(categoryId: string): Promise<any[]> {
    return this.prisma.subcategory.findMany({
      where: { categoryId, active: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { products: true } } },
    });
  }

  async create(data: CreateSubcategoryDto): Promise<any> {
    return this.prisma.subcategory.create({
      data,
      include: { category: true },
    });
  }

  async update(id: string, data: UpdateSubcategoryDto): Promise<any> {
    return this.prisma.subcategory.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subcategory.delete({ where: { id } });
  }
}
