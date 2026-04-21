import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  roleId: string;

  @IsOptional()
  active?: boolean;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  cedula?: string;
}
