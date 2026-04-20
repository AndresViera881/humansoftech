import { Condition } from '@prisma/client';

export class ProductEntity {
  id: string;
  name: string;
  slug: string;
  price: number;
  categoryId: string;
  subcategoryId?: string | null;
  description?: string | null;
  images?: string[];
  badge?: string | null;
  stock?: number | null;
  active?: boolean;
  featured?: boolean;
  condition?: Condition | null;
  createdAt: Date;
  updatedAt: Date;
}
