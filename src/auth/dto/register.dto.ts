import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ required: true, example: "john" })
  @IsString({ message: "Username là bắt buộc" })
  username: string;

  @ApiProperty({ required: false, example: "john@gmail.com" })
  @IsOptional()
  @IsEmail({}, { message: "Email không hợp lệ" })
  email?: string;

  @ApiProperty({ minLength: 6 })
  @IsString({ message: "Password là bắt buộc" })
  @MinLength(6, { message: "Password phải từ 6 ký tự trở lên" })
  password: string;
}
