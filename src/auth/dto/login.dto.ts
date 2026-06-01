import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ required: true, example: "john" })
  @IsString({ message: "Username là bắt buộc" })
  username: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6, { message: "Password phải từ 6 ký tự trở lên" })
  @IsNotEmpty({ message: "Password là bắt buộc" })
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  captchaToken?: string;
}
