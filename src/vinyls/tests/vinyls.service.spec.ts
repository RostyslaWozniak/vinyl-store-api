import { Test, TestingModule } from '@nestjs/testing';
import { VinylsService } from '../services';
import { PrismaService } from '../../prisma/prisma.service';
import { mockPrismaService } from '../../prisma/tests/mock/prisma-service.mock';
import { mockVinyl } from './mock/vinyls.mock';

describe('VinylsService', () => {
  let service: VinylsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VinylsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService(),
        },
      ],
    })

      .compile();

    service = module.get<VinylsService>(VinylsService);
  });

  it('should return list of vinyls', async () => {
    expect(
      await service.getVinylList({ page: 1, limit: 10, search: [], sort: [] }),
    ).toEqual([mockVinyl]);
  });
});
