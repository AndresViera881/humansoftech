import { ProductEntity } from '../../domain/entities/product.entity';

export class ProductMapper {
  static toDomain(prismaModel: any): ProductEntity {
    const entity = new ProductEntity();
    entity.id = prismaModel.id;
    entity.name = prismaModel.name;
    entity.slug = prismaModel.slug;
    entity.price = prismaModel.price;
    entity.categoryId = prismaModel.categoryId;
    entity.subcategoryId = prismaModel.subcategoryId;
    entity.description = prismaModel.description;
    entity.images = prismaModel.images;
    entity.badge = prismaModel.badge;
    entity.stock = prismaModel.stock;
    entity.active = prismaModel.active;
    entity.featured = prismaModel.featured;
    entity.condition = prismaModel.condition;
    entity.createdAt = prismaModel.createdAt;
    entity.updatedAt = prismaModel.updatedAt;
    return entity;
  }

  static toPrisma(entity: ProductEntity): Record<string, any> {
    return {
      name: entity.name,
      slug: entity.slug,
      price: entity.price,
      categoryId: entity.categoryId,
      subcategoryId: entity.subcategoryId,
      description: entity.description,
      images: entity.images,
      badge: entity.badge,
      stock: entity.stock,
      active: entity.active,
      featured: entity.featured,
      condition: entity.condition,
    };
  }
}
