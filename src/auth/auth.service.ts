import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { Role } from "./role.enum";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private signToken(
    payload: { sub: number; username: string; role: Role },
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload as any, {
      secret: this.configService.getOrThrow<string>("JWT_SECRET"),
      expiresIn: expiresIn as any,
    });
  }

  async register(dto: RegisterDto) {
    const role = dto.role ?? Role.USER;

    // business rule: only ADMIN can create MANAGER via special endpoint
    if (role !== Role.USER) {
      throw new BadRequestException("Only ADMIN can create MANAGER");
    }

    const exists = await (this.prisma as any).user.findFirst({
      where: { OR: [{ username: dto.username }, { email: dto.email }] },
    });

    if (exists)
      throw new BadRequestException("Username or email already exists");

    const password = await bcrypt.hash(dto.password, 10);

    return (this.prisma as any).user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password,
        role,
      },
      select: { id: true, username: true, email: true, role: true },
    });
  }

  async login(dto: LoginDto) {
    const user = await (this.prisma as any).user.findUnique({
      where: { username: dto.username },
    });

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    const expiresIn = dto.rememberMe
      ? "7d"
      : (this.configService.get<string>("JWT_EXPIRES_IN") ?? "1d");

    const access_token = this.signToken(
      { sub: user.id, username: user.username, role: user.role as any },
      expiresIn,
    );

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async createManager(dto: RegisterDto & { role: Role }) {
    // Caller must be ADMIN; Jwt/RolesGuard will enforce it.
    const role = Role.MANAGER;

    const exists = await (this.prisma as any).user.findFirst({
      where: { OR: [{ username: dto.username }, { email: dto.email }] },
    });

    if (exists)
      throw new BadRequestException("Username or email already exists");

    const password = await bcrypt.hash(dto.password, 10);

    return (this.prisma as any).user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password,
        role,
      },
      select: { id: true, username: true, email: true, role: true },
    });
  }
}
