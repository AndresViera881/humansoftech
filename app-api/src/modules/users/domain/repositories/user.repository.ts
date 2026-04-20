import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';

export abstract class UserRepository {
  abstract findAll(): Promise<any[]>;
  abstract findById(id: string): Promise<any | null>;
  abstract create(data: CreateUserDto): Promise<any>;
  abstract update(id: string, data: UpdateUserDto): Promise<any>;
  abstract delete(id: string): Promise<void>;
}
