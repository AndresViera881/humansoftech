import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  userId: string;

  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
