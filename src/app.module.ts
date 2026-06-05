import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductsModule } from "./products/products.module";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { ShopsModule } from "./shops/shops.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { UploadModule } from "./upload/upload.module";
import { CartModule } from "./cart/cart.module";
import { VouchersModule } from "./vouchers/vouchers.module";
import { OrdersModule } from "./orders/orders.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProductsModule,
    AuthModule,
    UsersModule,
    ShopsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
    }),
    UploadModule,
    CartModule,
    VouchersModule,
    OrdersModule,
  ],

  controllers: [AppController],
})
export class AppModule {}
