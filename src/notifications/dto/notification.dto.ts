import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum } from "class-validator";

export enum NotificationType {
  INFO = "info",
  ORDER = "order",
  PROMO = "promo",
  SYSTEM = "system",
}

export class CreateNotificationDto {
  @ApiProperty({ example: "Đơn hàng đã được xác nhận" })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: "Đơn hàng #123 của bạn đã được xác nhận" })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ enum: NotificationType, default: "info" })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({ example: "/orders/123" })
  @IsOptional()
  @IsString()
  link?: string;
}
