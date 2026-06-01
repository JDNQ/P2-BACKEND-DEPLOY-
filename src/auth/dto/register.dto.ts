import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsNotEmpty,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({ required: true, example: "john" })
  @IsString()
  @MinLength(6, { message: "Username phải từ 6 ký tự trở lên" })
  @IsNotEmpty({ message: "Username là bắt buộc" })
  username: string;

  @ApiProperty({ minLength: 6, required: true, example: "123456" })
  @IsString()
  @MinLength(6, { message: "Password phải từ 6 ký tự trở lên" })
  @IsNotEmpty({ message: "Password là bắt buộc" })
  password: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: "Vui lòng nhập lại mật khẩu" })
  confirmPassword: string;

  @ApiProperty({ required: false, example: "john@gmail.com" })
  @IsOptional()
  @IsEmail({}, { message: "Email không hợp lệ" })
  email?: string;
}
