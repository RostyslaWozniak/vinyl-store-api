import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from '../controllers';
import { ReviewsService } from '../services';
import { mockVinyl } from '../../vinyls/tests/mock/vinyls.mock';
import { QueryParams } from 'src/types';
import { CreateReviewDto } from '../dto';

describe('ReviewsController', () => {
  let controller: ReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {
            create: jest.fn(() => ({ message: 'Review created successfully' })),
            getAll: jest.fn(() => [mockVinyl]),
          },
        },
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  it('should return list of reviews', async () => {
    expect(await controller.getAll(mockVinyl.id, {} as QueryParams)).toEqual([
      mockVinyl,
    ]);
  });

  it('should return list of reviews', async () => {
    expect(
      await controller.create(
        mockVinyl.id,
        'currentUserId',
        {} as CreateReviewDto,
      ),
    ).toEqual({ message: 'Review created successfully' });
  });
});
