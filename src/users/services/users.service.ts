import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Role, User } from '@prisma/client';
import { UpdateUserDto, UserResponseDto } from '../dto';
import { UploadService } from '../../upload/service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ userId: string; email: string; role: Role }> {
    try {
      const newUser = await this.prisma.user.create({
        data: createUserDto,
      });

      return {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async findUniqueByEmail({
    email,
  }: {
    email: string;
  }): Promise<Pick<User, 'id' | 'email' | 'role' | 'hashPassword'>> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      hashPassword: user.hashPassword,
    };
  }

  async findUniqueById({ userId }: { userId: string }) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        hashPassword: false,
        hashRefreshToken: false,
        firstName: true,
        lastName: true,
        birthDate: true,
        avatarUrl: true,
        email: true,
        reviews: {
          select: {
            comment: true,
            score: true,
            vinyl: {
              select: {
                name: true,
                authorName: true,
                description: true,
                coverUrl: true,
                price: true,
              },
            },
          },
        },
        purchase: {
          select: {
            vinyl: {
              select: {
                name: true,
                authorName: true,
                description: true,
                coverUrl: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }

  async getUserProfile({
    userId,
  }: {
    userId: string;
  }): Promise<UserResponseDto> {
    const user = await this.findUniqueById({ userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      avatarUrl: user.avatarUrl,
      purchases: user.purchase,
      reviews: user.reviews,
    };
  }

  async updateUserProfile({
    userId,
    dto: { firstName, lastName, birthDate },
  }: {
    userId: string;
    dto: UpdateUserDto;
  }): Promise<{ message: string }> {
    const user = await this.findUniqueById({ userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      data: {
        firstName: firstName ?? user.firstName,
        lastName: lastName ?? user.lastName,
        birthDate: birthDate ?? user.birthDate,
      },
      where: { id: userId },
    });
    return { message: "User's profile updated" };
  }

  async remove({ userId }: { userId: string }): Promise<{ message: string }> {
    const user = await this.findUniqueById({ userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.avatarUrl) {
      this.uploadService.delete({ fileUrl: user.avatarUrl });
    }
    await this.prisma.user.delete({ where: { id: userId } });

    return { message: 'User deleted successfully' };
  }

  async updateUserAvatar({
    userId,
    fileName,
    file,
  }: {
    userId: string;
    fileName: string;
    file: Buffer;
  }): Promise<{ message: string }> {
    const user = await this.findUniqueById({ userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.avatarUrl) {
      this.uploadService.delete({ fileUrl: user.avatarUrl });
    }
    const avatarUrl = await this.uploadService.upload({ fileName, file });

    await this.prisma.user.update({
      data: {
        avatarUrl,
      },
      where: { id: userId },
    });
    return { message: "User's avatar updated" };
  }
}
