import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hash },
    });
  }

  private async getTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async register(dto: AuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) throw new ConflictException('Registration failed.');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: passwordHash },
    });

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { user: { email: user.email }, ...tokens };
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Wrong password or email.');

    const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordCorrect)
      throw new UnauthorizedException('Wrong password or email.');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { user: { email: user.email, role: user.role }, ...tokens };
  }

  async refresh(dto: { refreshToken: string }) {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        dto.refreshToken,
        { secret: process.env.JWT_REFRESH_SECRET },
      );

      const userId = Number(payload.sub);

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.hashedRefreshToken) throw new Error();

      const rtMatches = await bcrypt.compare(
        dto.refreshToken,
        user.hashedRefreshToken,
      );
      if (!rtMatches) throw new UnauthorizedException('Access Denied');

      const tokens = await this.getTokens(user.id, user.email, user.role);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (err) {
      throw new UnauthorizedException(
        `Session expired. Please log in again, ${err}`,
      );
    }
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: { not: null },
      },
      data: { hashedRefreshToken: null },
    });
  }
}
