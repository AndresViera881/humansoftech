export type Category = 'Laptops' | 'Celulares' | 'Tablets' | 'Teclados' | 'Ratones' | 'Auriculares' | 'Monitores' | (string & {});

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  badge?: string;
  isNew?: boolean;
  condition?: 'nuevo' | 'seminuevo';
  createdAt?: string;
}
