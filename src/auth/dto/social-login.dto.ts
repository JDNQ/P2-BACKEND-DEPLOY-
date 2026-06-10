import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class SocialLoginDto {
  @ApiProperty({ example: "ya29.a0AfH6SMB..." })
  @IsString()
  @IsNotEmpty()
  token: string;
}
