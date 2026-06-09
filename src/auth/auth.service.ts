import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

  private readonly loginAttempts = new Map<string, number>();

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException("Mật khẩu nhập lại không khớp");
    }

    const exists = await (this.prisma as any).user.findFirst({
      where: {
        OR: [
          { username: dto.username },
          ...(dto.email ? [{ email: dto.email }] : []),
        ],
      },
    });

    if (exists) throw new BadRequestException("Username hoặc email đã tồn tại");

    const password = await bcrypt.hash(dto.password, 10);

    return (this.prisma as any).user.create({
      data: {
        username: dto.username,
        email: dto.email ?? null,
        password,
        role: Role.USER,
      },

      select: { id: true, username: true, email: true, role: true },
    });
  }

  async login(dto: LoginDto) {
    const user = await (this.prisma as any).user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      const current = this.loginAttempts.get(dto.username) ?? 0;
      const next = current + 1;
      this.loginAttempts.set(dto.username, next);

      if (next >= 3) {
        throw new UnauthorizedException(
          "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau.",
        );
      }

      throw new UnauthorizedException("Sai username hoặc password");
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      const current = this.loginAttempts.get(dto.username) ?? 0;
      const next = current + 1;
      this.loginAttempts.set(dto.username, next);

      if (next >= 3) {
        throw new UnauthorizedException(
          "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau.",
        );
      }

      throw new UnauthorizedException("Sai username hoặc password");
    }

    // Success -> reset counter
    this.loginAttempts.set(dto.username, 0);

    const expiresIn = this.configService.get<string>("JWT_EXPIRES_IN") ?? "1d";

    const access_token = this.signToken(
      { sub: user.id, username: user.username, role: user.role as Role },
      expiresIn,
    );

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async createManager(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException("Mật khẩu nhập lại không khớp");
    }

    const exists = await (this.prisma as any).user.findFirst({
      where: {
        OR: [
          { username: dto.username },
          ...(dto.email ? [{ email: dto.email }] : []),
        ],
      },
    });

    if (exists) throw new BadRequestException("Username hoặc email đã tồn tại");

    const password = await bcrypt.hash(dto.password, 10);

    return (this.prisma as any).user.create({
      data: {
        username: dto.username,
        email: dto.email ?? null,
        password,
        role: Role.MANAGER,
      },

      select: { id: true, username: true, email: true, role: true },
    });
  }

  async getProfile(userId: number) {
    const user = await (this.prisma as any).user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
