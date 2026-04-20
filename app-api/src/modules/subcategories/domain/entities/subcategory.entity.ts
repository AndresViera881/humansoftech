export class SubcategoryEntity {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description?: string | null;
  image?: string | null;
  active?: boolean;
  sortOrder?: number | null;
  createdAt: Date;
  updatedAt: Date;
}
