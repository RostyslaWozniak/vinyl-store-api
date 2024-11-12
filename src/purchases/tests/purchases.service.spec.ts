import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesService } from '../services';
import { VinylsService } from '../../vinyls/services';
import { UsersService } from '../../users/services';
import { PrismaService } from '../../prisma/prisma.service';
import { mockPrismaService } from '../../prisma/tests/mock/prisma-service.mock';
import { EmailService } from '../../email/services';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { stripeConfig } from '../../configs';
import { mockVinyl } from '../../vinyls/tests/mock/vinyls.mock';
import { mockPurchase } from './mock/purchases.mock';

describe('PurchasesService', () => {
  let service: PurchasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [stripeConfig],
          cache: true,
        }),
      ],
      providers: [
        PurchasesService,
        {
          provide: VinylsService,
          useValue: {
            getVinylById: jest.fn().mockResolvedValue(mockVinyl),
          },
        },
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: EmailService,
          useValue: {},
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService(),
        },

        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation(() => ({
              stripeApiKey: 'stripeApiKey',
              stripeWebhookSecret: 'stripeWebhookSecret',
            })),
          },
        },
      ],
    }).compile();

    service = module.get<PurchasesService>(PurchasesService);
  });

  it('should be defined', async () => {
    expect(
      await service.getUserPurchases({
        userId: 'userId',
      }),
    ).toEqual([mockPurchase]);
  });
});
