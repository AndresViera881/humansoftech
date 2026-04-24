export class CreateMenuDto {
  label: string;
  icon?: string;
  path?: string;
  parentId?: string;
  sortOrder?: number;
  active?: boolean;
}
