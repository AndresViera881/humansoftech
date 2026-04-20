export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  active: boolean;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
}
