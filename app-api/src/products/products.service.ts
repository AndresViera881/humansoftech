import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug '${dto.slug}' already exists`);

    const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException(`Category ${dto.categoryId} not found`);

    if (dto.subcategoryId) {
      const sub = await this.prisma.subcategory.findUnique({ where: { id: dto.subcategoryId } });
      if (!sub) throw new NotFoundException(`Subcategory ${dto.subcategoryId} not found`);
    }

    return this.prisma.product.create({
      data: dto,
      include: { category: true, subcategory: true },
    });
  }

  async findAll(query: QueryProductDto) {
    const { categoryId, subcategoryId, search, minPrice, maxPrice, featured, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.ProductWhereInput = {
      active: true,
      ...(categoryId && { categoryId }),
      ...(subcategoryId && { subcategoryId }),
      ...(featured !== undefined && { featured }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
    };

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: { category: true, subcategory: true },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, subcategory: true },
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    const slug = (dto as { slug?: string }).slug;
    if (slug) {
      const conflict = await this.prisma.product.findFirst({
        where: { slug, NOT: { id } },
      });
      if (conflict) throw new ConflictException(`Slug '${slug}' already exists`);
    }
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true, subcategory: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
