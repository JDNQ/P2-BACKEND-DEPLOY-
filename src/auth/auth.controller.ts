import { Body, Controller, Post, HttpCode } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { Role } from "./role.enum";

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
  @ApiOperation({ summary: "ADMIN only: create manager" })
  createManager(@Body() dto: RegisterDto & { role: Role }) {
    return this.authService.createManager(dto);
  }
}
