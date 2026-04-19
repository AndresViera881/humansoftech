import 'dotenv/config';
import { createHash } from 'crypto';
import { PrismaClient } from '@prisma/client';

function hashPassword(raw: string): string {
  return createHash('sha256').update(raw + (process.env.PASSWORD_SALT ?? 'humansoftech_salt')).digest('hex');
}

const prisma = new PrismaClient();

async function main() {
  // Upsert roles
  const superAdmin = await prisma.role.upsert({
    where: { name: 'super_admin' },
    update: { description: 'Acceso total: productos y usuarios' },
    create: { name: 'super_admin', description: 'Acceso total: productos y usuarios' },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: { description: 'Gestión de productos, sin acceso a usuarios' },
    create: { name: 'admin', description: 'Gestión de productos, sin acceso a usuarios' },
  });

  console.log('✅ Roles creados/actualizados');

  // Andres Viera → super_admin
  const andres = await prisma.user.findUnique({ where: { email: 'aviera@humansoftechs.com' } });
  if (andres) {
    await prisma.user.update({ where: { id: andres.id }, data: { roleId: superAdmin.id } });
    console.log('✅ Andres Viera → super_admin');
  }

  // Ana Cristina → admin (upsert)
  await prisma.user.upsert({
    where: { email: 'anacristina@humansoftechs.com' },
    update: { roleId: adminRole.id },
    create: {
      name: 'Ana Cristina',
      email: 'anacristina@humansoftechs.com',
      password: hashPassword('AnaCristina123!'),
      roleId: adminRole.id,
      active: true,
    },
  });
  console.log('✅ Ana Cristina → admin');
  console.log('\n🎉 Listo. Credenciales:');
  console.log('   Andres Viera:  aviera@humansoftechs.com  /  #andres.Viera123!  (super_admin)');
  console.log('   Ana Cristina:  anacristina@humansoftechs.com  /  AnaCristina123!  (admin)');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
