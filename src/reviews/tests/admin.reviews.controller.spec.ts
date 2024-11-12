import { Test, TestingModule } from '@nestjs/testing';
import { AdminReviewsController } from '../controllers';
import { AdminReviewsService } from '../services';
import { mockReview } from './mock/reviews.mock';

describe('AdminReviewsController', () => {
  let controller: AdminReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminReviewsController],
      providers: [
        {
          provide: AdminReviewsService,
          useValue: {
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminReviewsController>(AdminReviewsController);
  });

  it('should remove review and return void', async () => {
    expect(await controller.remove(mockReview.id)).toEqual(undefined);
  });
});
