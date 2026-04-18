import { Product } from './types';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro X1',
    category: 'Laptops',
    price: 2499,
    description: 'Intel Core i9, 32GB RAM, 2TB NVMe, OLED 4K',
    images: ['/products/laptop.svg'],
    badge: 'TOP VENTAS',
  },
  {
    id: '2',
    name: 'Celular Nova X',
    category: 'Celulares',
    price: 1299,
    description: 'Snapdragon 8 Gen 3, 256GB, Cámara 200MP',
    images: ['/products/phone.svg'],
    badge: 'NUEVO',
  },
  {
    id: '3',
    name: 'Tablet Ultra 12',
    category: 'Tablets',
    price: 899,
    description: 'M3 Chip, 12" Liquid Retina, 5G integrado',
    images: ['/products/tablet.svg'],
  },
  {
    id: '4',
    name: 'Teclado Apex RGB',
    category: 'Teclados',
    price: 249,
    description: 'Mecánico, switches ópticos, RGB por tecla',
    images: ['/products/keyboard.svg'],
    badge: 'OFERTA',
  },
  {
    id: '5',
    name: 'Ratón Hyper X Pro',
    category: 'Ratones',
    price: 149,
    description: '26000 DPI, sensor óptico, 8 botones programables',
    images: ['/products/mouse.svg'],
  },
  {
    id: '6',
    name: 'Auriculares Void 7.1',
    category: 'Auriculares',
    price: 329,
    description: 'Surround 7.1, cancelación de ruido IA, 30h batería',
    images: ['/products/headphones.svg'],
    badge: 'PREMIUM',
  },
];

export const CATEGORIES = ['Todos', 'Laptops', 'Celulares', 'Tablets', 'Teclados', 'Ratones', 'Auriculares', 'Monitores'] as const;
