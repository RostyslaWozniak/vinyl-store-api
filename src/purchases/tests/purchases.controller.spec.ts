import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesController } from '../controllers';
import { mockPaymentResponse, mockPurchase } from './mock/purchases.mock';
import { PurchasesService } from '../services';

describe('PurchasesController', () => {
  let controller: PurchasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasesController],
      providers: [
        {
          provide: PurchasesService,
          useValue: {
            getUserPurchases: jest.fn().mockResolvedValue([mockPurchase]),
            buyProduct: jest.fn().mockResolvedValue(mockPaymentResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<PurchasesController>(PurchasesController);
  });

  it("should return list of user's purchases", async () => {
    expect(await controller.getPurchases('userId')).toEqual([mockPurchase]);
  });

  it('should return payment response', async () => {
    expect(await controller.buyProduct('userId', 'productId')).toEqual(
      mockPaymentResponse,
    );
  });
});
