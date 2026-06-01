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

    if (!user) throw new UnauthorizedException("Sai username hoặc password");

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException("Sai username hoặc password");

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
      },
    };
  }

  async createManager(dto: RegisterDto) {
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
}
