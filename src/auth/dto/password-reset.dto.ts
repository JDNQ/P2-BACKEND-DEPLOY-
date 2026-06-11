import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail({}, { message: "Email không hợp lệ" })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: "reset-token-here" })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ minLength: 6, example: "newpassword123" })
  @IsString()
  @MinLength(6, { message: "Mật khẩu tối thiểu 6 ký tự" })
  password: string;

  @ApiProperty({ minLength: 6, example: "newpassword123" })
  @IsString()
  @MinLength(6, { message: "Mật khẩu tối thiểu 6 ký tự" })
  confirmPassword: string;
}
