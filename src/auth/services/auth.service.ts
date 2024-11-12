import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { jwtConfig } from '../../configs';
import { ConfigType } from '@nestjs/config';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Tokens } from '../dto';
import { AuthDto, GoogleAuthDto } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(dto: AuthDto): Promise<Tokens> {
    const hashPassword = await this.hashData(dto.password);

    const { userId, email, role } = await this.usersService.create({
      email: dto.email,
      hashPassword,
    });

    const tokens = await this.getTokens({
      userId: userId,
      email: email,
      role,
    });

    await this.updateRefreshTokenHash(userId, tokens.refreshToken);

    return tokens;
  }

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.usersService.findUniqueByEmail({
      email: dto.email,
    });

    if (!user) throw new NotFoundException('User not found');

    if (!user.hashPassword)
      throw new UnauthorizedException('Please sign in using Google');

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.hashPassword,
    );

    if (!isPasswordValid) throw new ForbiddenException('Invalid credentials');

    const tokens = await this.getTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async signUpGoogle(user: GoogleAuthDto): Promise<Tokens> {
    const { userId, email, role } = await this.usersService.create(user);
    const tokens = await this.getTokens({
      userId,
      email,
      role,
    });

    await this.updateRefreshTokenHash(userId, tokens.refreshToken);

    return tokens;
  }

  async loginGoogle(user: GoogleAuthDto): Promise<Tokens> {
    const exsistingUser = await this.usersService.findUniqueByEmail({
      email: user.email,
    });

    if (!exsistingUser) {
      return this.signUpGoogle(user);
    }
    const tokens = await this.getTokens({
      userId: exsistingUser.id,
      email: exsistingUser.email,
      role: exsistingUser.role as Role,
    });
    await this.updateRefreshTokenHash(exsistingUser.id, tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashRefreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await bcrypt.compare(rt, user.hashRefreshToken);
    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const { accessToken, refreshToken } = await this.getTokens({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });
    await this.updateRefreshTokenHash(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashRefreshToken: {
          not: null,
        },
      },
      data: {
        hashRefreshToken: null,
      },
    });
  }

  async updateRefreshTokenHash(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hash = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashRefreshToken: hash,
      },
    });
  }

  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }
  async getTokens({
    userId,
    email,
    role,
  }: {
    userId: string;
    email: string;
    role: Role;
  }): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.jwt.atSecret,
          expiresIn: this.jwt.accessTokenExpiresIn ?? ACCESS_TOKEN_EXPIRES_IN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.jwt.rtSecret,
          expiresIn: this.jwt.refreshTokenExpiresIn ?? REFRESH_TOKEN_EXPIRES_IN,
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
