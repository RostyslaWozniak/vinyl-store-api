import { Test, TestingModule } from '@nestjs/testing';
import { VinylsController } from '../controllers';
import { VinylsService } from '../services';
import { mockVinyl } from './mock/vinyls.mock';

describe('VinylsController', () => {
  let controller: VinylsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VinylsController],
      providers: [
        {
          provide: VinylsService,
          useValue: {
            getVinylList: jest.fn().mockResolvedValue([mockVinyl]),
          },
        },
      ],
    }).compile();

    controller = module.get<VinylsController>(VinylsController);
  });

  it('should return list of vinyls', async () => {
    expect(await controller.getVinylList({})).toEqual([mockVinyl]);
  });
});
