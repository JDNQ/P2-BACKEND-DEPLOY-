import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
const uuidv4 = () => {
  // tránh phụ thuộc uuid package; đủ dùng cho filename multer
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
};

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          cb(null, `${uuidv4()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error("Only image files are allowed"), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
