import { Test, TestingModule } from '@nestjs/testing';
import { LogController } from '../controllers';
import { LogService } from '../services';
import { QueryParams } from 'src/types';
import { mockLog } from './mock/logs.mock';

describe('LogController', () => {
  let controller: LogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogController],
      providers: [
        {
          provide: LogService,
          useValue: {
            getLogs: jest.fn(() => [mockLog]),
          },
        },
      ],
    }).compile();

    controller = module.get<LogController>(LogController);
  });

  it('should return list of logs', async () => {
    expect(await controller.getLogs({} as QueryParams)).toEqual([mockLog]);
  });
});
