import 'dotenv/config';
import { createHash } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

function hashPassword(raw: string): string {
  return createHash('sha256').update(raw + (process.env.PASSWORD_SALT ?? 'humansoftech_salt')).digest('hex');
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: 'Laptops',
    slug: 'laptops',
    description: 'Portátiles de alto rendimiento para profesionales y gamers',
    sortOrder: 1,
    subcategories: [
      { name: 'Gaming', slug: 'gaming', description: 'Laptops para gaming de alta gama', sortOrder: 1 },
      { name: 'Ultrabooks', slug: 'ultrabooks', description: 'Delgadas y ligeras para productividad', sortOrder: 2 },
      { name: 'Workstations', slug: 'workstations', description: 'Para diseño y trabajo pesado', sortOrder: 3 },
    ],
  },
  {
    name: 'Celulares',
    slug: 'celulares',
    description: 'Smartphones con la última tecnología móvil',
    sortOrder: 2,
    subcategories: [
      { name: 'Android', slug: 'android', description: 'Smartphones con sistema Android', sortOrder: 1 },
      { name: 'iPhone', slug: 'iphone', description: 'Smartphones Apple iPhone', sortOrder: 2 },
      { name: 'Gama Alta', slug: 'gama-alta', description: 'Flagships premium', sortOrder: 3 },
    ],
  },
  {
    name: 'Tablets',
    slug: 'tablets',
    description: 'Tablets para creatividad y productividad',
    sortOrder: 3,
    subcategories: [
      { name: 'iPad', slug: 'ipad', description: 'Tablets Apple iPad', sortOrder: 1 },
      { name: 'Android Tablets', slug: 'android-tablets', description: 'Tablets con Android', sortOrder: 2 },
    ],
  },
  {
    name: 'Teclados',
    slug: 'teclados',
    description: 'Teclados mecánicos y de membrana RGB',
    sortOrder: 4,
    subcategories: [
      { name: 'Mecánicos', slug: 'mecanicos', description: 'Teclados con switches mecánicos', sortOrder: 1 },
      { name: 'Inalámbricos', slug: 'inalambricos', description: 'Teclados sin cables', sortOrder: 2 },
    ],
  },
  {
    name: 'Ratones',
    slug: 'ratones',
    description: 'Ratones gaming y de oficina de precisión',
    sortOrder: 5,
    subcategories: [
      { name: 'Gaming', slug: 'gaming-mouse', description: 'Ratones para gaming', sortOrder: 1 },
      { name: 'Ergonómicos', slug: 'ergonomicos', description: 'Diseño ergonómico para largas jornadas', sortOrder: 2 },
    ],
  },
  {
    name: 'Auriculares',
    slug: 'auriculares',
    description: 'Audio de alta fidelidad y gaming',
    sortOrder: 6,
    subcategories: [
      { name: 'Gaming Headsets', slug: 'gaming-headsets', description: 'Auriculares para gaming con micrófono', sortOrder: 1 },
      { name: 'Hi-Fi', slug: 'hi-fi', description: 'Auriculares de alta fidelidad', sortOrder: 2 },
      { name: 'In-Ear', slug: 'in-ear', description: 'Auriculares intraurales TWS', sortOrder: 3 },
    ],
  },
  {
    name: 'Monitores',
    slug: 'monitores',
    description: 'Pantallas para gaming, diseño y productividad',
    sortOrder: 7,
    subcategories: [
      { name: 'Gaming', slug: 'gaming-monitor', description: 'Alta frecuencia de refresco para gaming', sortOrder: 1 },
      { name: '4K', slug: '4k', description: 'Resolución Ultra HD 4K', sortOrder: 2 },
      { name: 'Ultrawide', slug: 'ultrawide', description: 'Pantallas panorámicas curvas', sortOrder: 3 },
    ],
  },
];

const brands = [
  { name: 'Apple',      slug: 'apple',      description: 'Tecnología premium — Mac, iPhone, iPad, AirPods',        website: 'https://apple.com',      sortOrder: 1  },
  { name: 'Samsung',    slug: 'samsung',    description: 'Electrónica de consumo, smartphones y monitores',         website: 'https://samsung.com',    sortOrder: 2  },
  { name: 'Sony',       slug: 'sony',       description: 'Audio de alta fidelidad, cámaras y gaming',               website: 'https://sony.com',       sortOrder: 3  },
  { name: 'Logitech',   slug: 'logitech',   description: 'Periféricos y accesorios para PC y productividad',        website: 'https://logitech.com',   sortOrder: 4  },
  { name: 'Razer',      slug: 'razer',      description: 'Gaming gear premium — teclados, ratones y headsets',      website: 'https://razer.com',      sortOrder: 5  },
  { name: 'Lenovo',     slug: 'lenovo',     description: 'Laptops ThinkPad, IdeaPad y tablets',                     website: 'https://lenovo.com',     sortOrder: 6  },
  { name: 'ASUS',       slug: 'asus',       description: 'Laptops, placas madre, monitores y routers',              website: 'https://asus.com',       sortOrder: 7  },
  { name: 'Xiaomi',     slug: 'xiaomi',     description: 'Smartphones, wearables y accesorios asequibles',          website: 'https://xiaomi.com',     sortOrder: 8  },
  { name: 'HP',         slug: 'hp',         description: 'Laptops, impresoras y equipos de oficina',                website: 'https://hp.com',         sortOrder: 9  },
  { name: 'Dell',       slug: 'dell',       description: 'Laptops XPS, Inspiron y workstations',                    website: 'https://dell.com',       sortOrder: 10 },
  { name: 'Microsoft',  slug: 'microsoft',  description: 'Surface, accesorios y software',                          website: 'https://microsoft.com',  sortOrder: 11 },
  { name: 'Huawei',     slug: 'huawei',     description: 'Smartphones, laptops y wearables',                        website: 'https://huawei.com',     sortOrder: 12 },
  { name: 'SteelSeries',slug: 'steelseries',description: 'Periféricos gaming de alta precisión',                    website: 'https://steelseries.com',sortOrder: 13 },
  { name: 'HyperX',     slug: 'hyperx',     description: 'Memorias, headsets y accesorios gaming',                  website: 'https://hyperx.com',     sortOrder: 14 },
  { name: 'Corsair',    slug: 'corsair',    description: 'Memorias RAM, fuentes de poder y periféricos',            website: 'https://corsair.com',    sortOrder: 15 },
  { name: 'LG',         slug: 'lg',         description: 'Monitores, televisores y electrodomésticos',              website: 'https://lg.com',         sortOrder: 16 },
  { name: 'Acer',       slug: 'acer',       description: 'Laptops, monitores y proyectores',                        website: 'https://acer.com',       sortOrder: 17 },
  { name: 'Jabra',      slug: 'jabra',      description: 'Auriculares y soluciones de audio profesional',           website: 'https://jabra.com',      sortOrder: 18 },
  { name: 'Anker',      slug: 'anker',      description: 'Cargadores, cables y accesorios de carga',                website: 'https://anker.com',      sortOrder: 19 },
  { name: 'Motorola',   slug: 'motorola',   description: 'Smartphones accesibles y de gama media',                  website: 'https://motorola.com',   sortOrder: 20 },
];

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Roles
  const adminRole = await prisma.role.create({ data: { name: 'admin', description: 'Acceso total al panel de administración' } });
  await prisma.role.create({ data: { name: 'editor', description: 'Puede crear y editar productos' } });

  // Users
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'aviera@humansoftechs.com',
      password: hashPassword('#andres.Viera123!'),
      roleId: adminRole.id,
    },
  });
  console.log('✅ Roles y usuarios creados');

  // Brands
  const createdBrands: Record<string, string> = {};
  for (const brand of brands) {
    const b = await prisma.brand.create({ data: brand });
    createdBrands[brand.slug] = b.id;
  }
  console.log(`✅ ${brands.length} marcas creadas`);

  // Categories + subcategories
  for (const cat of categories) {
    const { subcategories: subs, ...catData } = cat;
    const created = await prisma.category.create({ data: catData });
    for (const sub of subs) {
      await prisma.subcategory.create({ data: { ...sub, categoryId: created.id } });
    }
  }
  console.log(`✅ ${categories.length} categorías creadas`);

  console.log(`\n🎉 Seed completo: ${brands.length} marcas, ${categories.length} categorías, 0 productos`);
  console.log('   Login: admin@techstore.com / admin123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
