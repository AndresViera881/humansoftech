export class CreatePermissionDto {
  name: string;
  description?: string;
  resource: string;
  action: string;
}
