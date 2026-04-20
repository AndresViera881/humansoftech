import { SubcategoryEntity } from '../../domain/entities/subcategory.entity';

export class SubcategoryMapper {
  static toDomain(prismaModel: any): SubcategoryEntity {
    const entity = new SubcategoryEntity();
    entity.id = prismaModel.id;
    entity.name = prismaModel.name;
    entity.slug = prismaModel.slug;
    entity.categoryId = prismaModel.categoryId;
    entity.description = prismaModel.description;
    entity.image = prismaModel.image;
    entity.active = prismaModel.active;
    entity.sortOrder = prismaModel.sortOrder;
    entity.createdAt = prismaModel.createdAt;
    entity.updatedAt = prismaModel.updatedAt;
    return entity;
  }

  static toPrisma(entity: SubcategoryEntity): Record<string, any> {
    return {
      name: entity.name,
      slug: entity.slug,
      categoryId: entity.categoryId,
      description: entity.description,
      image: entity.image,
      active: entity.active,
      sortOrder: entity.sortOrder,
    };
  }
}
