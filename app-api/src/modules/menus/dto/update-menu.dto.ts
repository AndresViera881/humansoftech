export class UpdateMenuDto {
  label?: string;
  icon?: string;
  path?: string;
  parentId?: string | null;
  sortOrder?: number;
  active?: boolean;
}
