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

@ApiTags("upload")
@Controller("upload")
export class UploadController {
  // Upload nhiều ảnh cho product (tối đa 10)
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
  uploadProductImages(@UploadedFiles() files: any[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException("No files uploaded");
    }

    return {
      urls: files.map((f) => `/uploads/${f.filename}`),
    };
  }

  // Upload 1 ảnh cho variant
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
  uploadVariantImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    return { url: `/uploads/${file.filename}` };
  }
}
