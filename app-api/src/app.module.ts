import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SubcategoriesModule } from './modules/subcategories/subcategories.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { VisitsModule } from './modules/visits/visits.module';
import { MenusModule } from './modules/menus/menus.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { JwtAuthGuard } from './shared/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './shared/auth/guards/permissions.guard';

@Module({
  imports: [
    PrismaModule,
    CategoriesModule,
    SubcategoriesModule,
    ProductsModule,
    AuthModule,
    UploadModule,
    UsersModule,
    RolesModule,
    VisitsModule,
    MenusModule,
    PermissionsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
