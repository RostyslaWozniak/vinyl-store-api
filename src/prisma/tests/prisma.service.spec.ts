import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbConfig } from '../../configs';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [dbConfig],
          cache: true,
        }),
      ],
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation(() => ({
              dbUrl: 'dbUrl',
            })),
          },
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('connect method should be defined', () => {
    expect(service.onModuleInit).toBeDefined();
  });
  it('disconnect method should be defined', () => {
    expect(service.onModuleDestroy).toBeDefined();
  });
});
