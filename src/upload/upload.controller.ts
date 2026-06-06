import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      },
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

@ApiTags("upload")
@Controller("upload")
export class UploadController {
  @Post("product-images")
  @ApiOperation({ summary: "Upload multiple product images (max 10)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: { type: "array", items: { type: "string", format: "binary" } },
      },
    },
  })
  @UseInterceptors(FilesInterceptor("files", 10))
  async uploadProductImages(@UploadedFiles() files: any[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException("No files uploaded");
    }

    const urls = await Promise.all(
      files.map((f) => uploadToCloudinary(f.buffer, "tlmarket/products")),
    );

    return { urls };
  }

  @Post("variant-image")
  @ApiOperation({ summary: "Upload single variant image" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadVariantImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const url = await uploadToCloudinary(file.buffer, "tlmarket/variants");
    return { url };
  }
}
