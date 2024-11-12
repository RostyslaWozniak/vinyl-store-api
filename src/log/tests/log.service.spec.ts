import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from '../services';
import { mockPrismaService } from '../../prisma/tests/mock/prisma-service.mock';
import { PrismaService } from '../../prisma/prisma.service';
import { mockLog } from './mock/logs.mock';

describe('LogService', () => {
  let service: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogService,
        {
          provide: PrismaService,
          useValue: mockPrismaService(),
        },
      ],
    }).compile();

    service = module.get<LogService>(LogService);
  });

  it('should return list of logs', async () => {
    expect(await service.getLogs({ sort: [], search: [] })).toEqual([mockLog]);
  });
});
