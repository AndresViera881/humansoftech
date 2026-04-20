export abstract class RoleRepository {
  abstract findAll(): Promise<any[]>;
}
