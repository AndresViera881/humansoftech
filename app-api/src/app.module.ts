import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { VisitsModule } from './visits/visits.module';

@Module({
  imports: [PrismaModule, CategoriesModule, SubcategoriesModule, ProductsModule, AuthModule, UploadModule, UsersModule, RolesModule, VisitsModule],
})
export class AppModule {}
