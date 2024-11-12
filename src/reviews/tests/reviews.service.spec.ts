import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from '../services';
import { PrismaService } from '../../prisma/prisma.service';
import { VinylsService } from '../../vinyls/services';
import { mockPrismaService } from '../../prisma/tests/mock/prisma-service.mock';
import { mockVinyl } from '../../vinyls/tests/mock/vinyls.mock';
import { mockReview } from './mock/reviews.mock';
import { CreateReviewDto } from '../dto';

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService(),
        },
        {
          provide: VinylsService,
          useValue: {
            updateAvgScore: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should return all reviews of particular vinyl', async () => {
    expect(
      await service.getAll(mockVinyl.id, { sort: [], search: [] }),
    ).toEqual([mockReview]);
  });

  it('should create new review for the particular vinyl and return message', async () => {
    expect(
      await service.create(
        {} as CreateReviewDto & { vinylId: string; userId: string },
      ),
    ).toEqual({ message: 'Review added successfully' });
  });
});
