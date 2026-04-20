import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SubcategoriesModule } from './modules/subcategories/subcategories.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { VisitsModule } from './modules/visits/visits.module';

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
  ],
})
export class AppModule {}
