import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import { UploadController } from "./upload.controller";

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [
    {
      provide: "CLOUDINARY",
      useFactory: (config: ConfigService) => {
        cloudinary.config({
          cloud_name: config.get("CLOUDINARY_CLOUD_NAME"),
          api_key: config.get("CLOUDINARY_API_KEY"),
          api_secret: config.get("CLOUDINARY_API_SECRET"),
        });
        return cloudinary;
      },
      inject: [ConfigService],
    },
  ],
  exports: ["CLOUDINARY"],
})
export class UploadModule {}
