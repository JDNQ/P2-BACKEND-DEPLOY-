import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductsModule } from "./products/products.module";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { ShopsModule } from "./shops/shops.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProductsModule,
    AuthModule,
    UsersModule,
    ShopsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
