import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- Menus ---
  const menusData = [
    { label: 'Analítica', icon: 'chart', path: 'visits', sortOrder: 1 },
    {
      label: 'Inventario', icon: 'box', path: null, sortOrder: 2,
      children: [
        { label: 'Productos', icon: 'tag', path: 'inventory', sortOrder: 1 },
        { label: 'Categorías', icon: 'folder', path: 'categories', sortOrder: 2 },
        { label: 'Subcategorías', icon: 'folder-open', path: 'subcategories', sortOrder: 3 },
      ],
    },
    {
      label: 'Seguridad', icon: 'shield', path: null, sortOrder: 3,
      children: [
        { label: 'Usuarios', icon: 'users', path: 'users', sortOrder: 1 },
        { label: 'Roles', icon: 'key', path: 'roles', sortOrder: 2 },
        { label: 'Menús', icon: 'menu', path: 'menus', sortOrder: 3 },
        { label: 'Permisos', icon: 'lock', path: 'permissions', sortOrder: 4 },
      ],
    },
  ];

  const createdMenus: Record<string, string> = {};

  for (const m of menusData) {
    const { children, ...menuData } = m as typeof m & { children?: typeof m[] };
    const parent = await prisma.menu.upsert({
      where: { id: `menu_${menuData.path ?? menuData.label.toLowerCase()}` },
      update: { label: menuData.label, icon: menuData.icon, path: menuData.path, sortOrder: menuData.sortOrder },
      create: { id: `menu_${menuData.path ?? menuData.label.toLowerCase()}`, ...menuData },
    });
    createdMenus[menuData.label] = parent.id;

    if (children) {
      for (const c of children) {
        const child = await prisma.menu.upsert({
          where: { id: `menu_${c.path}` },
          update: { label: c.label, icon: c.icon, path: c.path, sortOrder: c.sortOrder, parentId: parent.id },
          create: { id: `menu_${c.path}`, ...c, parentId: parent.id },
        });
        createdMenus[c.label] = child.id;
      }
    }
  }

  // --- Permissions ---
  const permsData = [
    { name: 'products:read', resource: 'products', action: 'read', description: 'Ver productos' },
    { name: 'products:write', resource: 'products', action: 'write', description: 'Crear/editar productos' },
    { name: 'products:delete', resource: 'products', action: 'delete', description: 'Eliminar productos' },
    { name: 'categories:read', resource: 'categories', action: 'read', description: 'Ver categorías' },
    { name: 'categories:write', resource: 'categories', action: 'write', description: 'Crear/editar categorías' },
    { name: 'categories:delete', resource: 'categories', action: 'delete', description: 'Eliminar categorías' },
    { name: 'users:read', resource: 'users', action: 'read', description: 'Ver usuarios' },
    { name: 'users:write', resource: 'users', action: 'write', description: 'Crear/editar usuarios' },
    { name: 'users:delete', resource: 'users', action: 'delete', description: 'Eliminar usuarios' },
    { name: 'roles:manage', resource: 'roles', action: 'manage', description: 'Gestionar roles y accesos' },
    { name: 'menus:manage', resource: 'menus', action: 'manage', description: 'Gestionar menús' },
    { name: 'permissions:manage', resource: 'permissions', action: 'manage', description: 'Gestionar permisos' },
    { name: 'analytics:read', resource: 'analytics', action: 'read', description: 'Ver analítica' },
  ];

  for (const p of permsData) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: p,
      create: p,
    });
  }

  // --- Assign all menus & permissions to super_admin ---
  const superAdmin = await prisma.role.findUnique({ where: { name: 'super_admin' } });
  const admin = await prisma.role.findUnique({ where: { name: 'admin' } });

  const allMenus = await prisma.menu.findMany();
  const allPerms = await prisma.permission.findMany();

  if (superAdmin) {
    await prisma.roleMenu.deleteMany({ where: { roleId: superAdmin.id } });
    await prisma.roleMenu.createMany({
      data: allMenus.map(m => ({ roleId: superAdmin.id, menuId: m.id })),
    });
    await prisma.rolePermission.deleteMany({ where: { roleId: superAdmin.id } });
    await prisma.rolePermission.createMany({
      data: allPerms.map(p => ({ roleId: superAdmin.id, permissionId: p.id })),
    });
    console.log('✓ super_admin: all menus & permissions assigned');
  }

  if (admin) {
    const adminMenuPaths = ['visits', 'Inventario', 'inventory', 'categories', 'subcategories', 'users', 'Seguridad'];
    const adminMenuIds = allMenus
      .filter(m => adminMenuPaths.includes(m.path ?? m.label))
      .map(m => m.id);

    await prisma.roleMenu.deleteMany({ where: { roleId: admin.id } });
    await prisma.roleMenu.createMany({
      data: adminMenuIds.map(menuId => ({ roleId: admin.id, menuId })),
    });

    const adminPermNames = ['products:read','products:write','products:delete','categories:read','categories:write','categories:delete','users:read','users:write','analytics:read'];
    const adminPermIds = allPerms.filter(p => adminPermNames.includes(p.name)).map(p => p.id);

    await prisma.rolePermission.deleteMany({ where: { roleId: admin.id } });
    await prisma.rolePermission.createMany({
      data: adminPermIds.map(permissionId => ({ roleId: admin.id, permissionId })),
    });
    console.log('✓ admin: menus & permissions assigned');
  }

  console.log('RBAC seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
