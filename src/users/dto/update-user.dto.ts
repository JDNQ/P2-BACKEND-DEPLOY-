import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEmail, IsEnum } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "newusername" })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: "newemail@example.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "https://res.cloudinary.com/..." })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class UpdateUserRoleDto {
  @ApiPropertyOptional({ enum: ["ADMIN", "MANAGER", "USER"], example: "MANAGER" })
  @IsEnum(["ADMIN", "MANAGER", "USER"])
  role: string;
}

export class ToggleUserStatusDto {
  @ApiPropertyOptional({ enum: ["Active", "Banned"], example: "Banned" })
  @IsEnum(["Active", "Banned"])
  status: string;
}
