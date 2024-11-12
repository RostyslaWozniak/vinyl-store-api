import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from '../dto';
import { QueryParams } from '../../types';
import { VinylsService } from '../../vinyls/services';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { VinylReviewDto } from '../dto/vinyl-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vinylsService: VinylsService,
  ) {}

  async getAll(
    vinylId: string,
    { page, limit, search, sort }: QueryParams,
  ): Promise<VinylReviewDto[]> {
    try {
      return await this.prisma.review.findMany({
        select: {
          comment: true,
          score: true,
          user: {
            select: { firstName: true, lastName: true },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
        where: {
          vinylId,
          AND: search.map(({ field, value }) => ({
            [field]: {
              contains: value,
            },
          })),
        },
        orderBy: sort.map(({ field, by }) => ({
          [field]: by,
        })),
      });
    } catch (err) {
      if (err instanceof PrismaClientValidationError) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException(err as Error);
    }
  }

  async create({
    userId,
    vinylId,
    comment,
    score,
  }: CreateReviewDto & { vinylId: string; userId: string }): Promise<{
    message: string;
  }> {
    await this.prisma.review.create({
      data: {
        userId,
        vinylId,
        comment,
        score,
      },
    });
    await this.calculateAvgScore({ vinylId });

    return { message: 'Review added successfully' };
  }

  async calculateAvgScore({ vinylId }: { vinylId: string }): Promise<void> {
    const {
      _avg: { score: averageScore },
    } = await this.prisma.review.aggregate({
      _avg: { score: true },
      where: { vinylId },
    });
    await this.vinylsService.updateAvgScore({
      vinylId,
      averageScore: averageScore,
    });
  }
}
