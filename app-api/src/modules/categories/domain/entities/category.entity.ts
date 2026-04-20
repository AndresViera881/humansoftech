export class CategoryEntity {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  active?: boolean;
  sortOrder?: number | null;
  createdAt: Date;
  updatedAt: Date;
}
