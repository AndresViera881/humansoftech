import { CategoryEntity } from '../../domain/entities/category.entity';

export class CategoryMapper {
  static toDomain(prismaModel: any): CategoryEntity {
    const entity = new CategoryEntity();
    entity.id = prismaModel.id;
    entity.name = prismaModel.name;
    entity.slug = prismaModel.slug;
    entity.description = prismaModel.description;
    entity.image = prismaModel.image;
    entity.active = prismaModel.active;
    entity.sortOrder = prismaModel.sortOrder;
    entity.createdAt = prismaModel.createdAt;
    entity.updatedAt = prismaModel.updatedAt;
    return entity;
  }

  static toPrisma(entity: CategoryEntity): Record<string, any> {
    return {
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      image: entity.image,
      active: entity.active,
      sortOrder: entity.sortOrder,
    };
  }
}
