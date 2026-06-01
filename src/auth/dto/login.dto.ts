import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ required: true, example: "john" })
  @IsString({ message: "Username là bắt buộc" })
  username: string;

  @ApiProperty({ minLength: 6 })
  @IsString({ message: "Password là bắt buộc" })
  @MinLength(6, { message: "Password phải từ 6 ký tự trở lên" })
  password: string;
}
