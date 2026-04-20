import { UserEntity } from '../../domain/entities/user.entity';

export class UserMapper {
  static toDomain(prismaModel: any): UserEntity {
    const entity = new UserEntity();
    entity.id = prismaModel.id;
    entity.name = prismaModel.name;
    entity.email = prismaModel.email;
    entity.password = prismaModel.password;
    entity.active = prismaModel.active;
    entity.roleId = prismaModel.roleId;
    entity.createdAt = prismaModel.createdAt;
    entity.updatedAt = prismaModel.updatedAt;
    return entity;
  }

  static toPrisma(entity: UserEntity): Record<string, any> {
    return {
      name: entity.name,
      email: entity.email,
      password: entity.password,
      active: entity.active,
      roleId: entity.roleId,
    };
  }
}
