import { Test, TestingModule } from '@nestjs/testing';
import { AdminReviewsService, ReviewsService } from '../services';
import { PrismaService } from '../../prisma/prisma.service';
import { mockPrismaService } from '../../prisma/tests/mock/prisma-service.mock';
import { mockVinyl } from '../../vinyls/tests/mock/vinyls.mock';

describe('AdminReviewsService', () => {
  let service: AdminReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminReviewsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService(),
        },
        {
          provide: ReviewsService,
          useValue: {
            remove: jest.fn(),
            calculateAvgScore: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminReviewsService>(AdminReviewsService);
  });

  it('should return all reviews of particular vinyl', async () => {
    expect(await service.remove({ reviewId: mockVinyl.id })).toEqual(undefined);
  });
});
