import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryParams } from '../../types';
import { VinylResponseDto } from '../dto';

@Injectable()
export class VinylsService {
  constructor(private readonly prisma: PrismaService) {}

  async getVinylList({
    page,
    limit,
    search,
    sort,
  }: QueryParams): Promise<VinylResponseDto[]> {
    try {
      return await this.prisma.vinyl.findMany({
        select: {
          name: true,
          authorName: true,
          description: true,
          price: true,
          averageScore: true,
          coverUrl: true,
          reviews: {
            select: {
              comment: true,
              score: true,
              user: {
                select: { firstName: true, lastName: true, avatarUrl: true },
              },
            },
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
        // sort
        orderBy: sort.map(({ field, by }) => ({
          [field]: by,
        })),
        // limit
        take: limit,
        // page
        skip: (page - 1) * limit,
        // search
        where: {
          AND: search.map(({ field, value }) => ({
            [field]: {
              contains: value,
              mode: 'insensitive',
            },
          })),
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientValidationError) {
        console.log(err);
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  async getVinylById({
    vinylId,
  }: {
    vinylId: string;
  }): Promise<VinylResponseDto> {
    return await this.prisma.vinyl.findUnique({
      select: {
        name: true,
        authorName: true,
        description: true,
        price: true,
        averageScore: true,
        coverUrl: true,
      },
      where: {
        id: vinylId,
      },
    });
  }

  async updateAvgScore({
    vinylId,
    averageScore,
  }: {
    vinylId: string;
    averageScore: number;
  }): Promise<void> {
    await this.prisma.vinyl.update({
      where: { id: vinylId },
      data: { averageScore },
    });
  }
}
