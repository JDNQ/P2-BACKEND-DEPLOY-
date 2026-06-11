import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { SocialLoginDto } from "./dto/social-login.dto";
import { ForgotPasswordDto, ResetPasswordDto } from "./dto/password-reset.dto";
import { Role } from "./role.enum";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "./roles.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: "Registered" })
  @HttpCode(201)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "Login" })
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("create-manager")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Manager only: create admin account" })
  createManager(@Body() dto: RegisterDto & { role: Role }) {
    return this.authService.createManager(dto);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @Post("social/:provider")
  @HttpCode(200)
  @ApiOperation({ summary: "Social login (google/facebook)" })
  @ApiParam({ name: "provider", example: "google", enum: ["google", "facebook"] })
  @ApiBody({ type: SocialLoginDto })
  socialLogin(
    @Param("provider") provider: string,
    @Body() dto: SocialLoginDto,
  ) {
    return this.authService.socialLogin(provider, dto.token);
  }

  @Post("forgot-password")
  @HttpCode(200)
  @ApiOperation({ summary: "Request password reset email" })
  @ApiBody({ type: ForgotPasswordDto })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post("reset-password")
  @HttpCode(200)
  @ApiOperation({ summary: "Reset password with token" })
  @ApiBody({ type: ResetPasswordDto })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
