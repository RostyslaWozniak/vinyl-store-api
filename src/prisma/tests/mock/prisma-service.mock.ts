import { mockPurchase } from '../../../purchases/tests/mock/purchases.mock';
import { mockLog } from '../../../log/tests/mock/logs.mock';
import { mockReview } from '../../../reviews/tests/mock/reviews.mock';
import { mockUser } from '../../../users/tests/mock/user.mock';
import { mockVinyl } from '../../../vinyls/tests/mock/vinyls.mock';

export const mockPrismaService = () => ({
  user: {
    create: jest.fn().mockResolvedValue(mockUser),
    findUnique: jest
      .fn()
      .mockResolvedValue({ ...mockUser, reviews: [], purchase: [] }),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  },
  vinyl: {
    create: jest.fn(),
    findUnique: jest.fn(() => mockVinyl),
    findMany: jest.fn(() => [mockVinyl]),
    update: jest.fn(),
    delete: jest.fn(),
  },
  review: {
    findMany: jest.fn(() => [mockReview]),
    findUnique: jest.fn(() => mockReview),
    create: jest.fn(() => ({ message: 'Review added successfully' })),
    aggregate: jest.fn(() => ({ _avg: { score: 5 } })),
    delete: jest.fn(),
  },
  purchase: {
    findMany: jest.fn(() => [mockPurchase]),
  },
  systemLog: {
    findMany: jest.fn(() => [mockLog]),
  },
});
