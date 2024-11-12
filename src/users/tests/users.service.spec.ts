import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services';
import { UploadService } from '../../upload/service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockPrismaService } from '../../prisma/tests/mock/prisma-service.mock';
import { mockUser, mockUserProfile } from './mock/user.mock';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UploadService,
          useValue: {
            upload: jest.fn().mockResolvedValue('https://example.com/avatar'),
          },
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a new user and return user id, email and role', async () => {
    expect(
      await service.create({
        email: mockUser.email,
        hashPassword: mockUser.hashPassword,
      }),
    ).toEqual({
      userId: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
    });
  });

  it("should return user's id, email, role and hashPassword", async () => {
    expect(
      await service.findUniqueByEmail({
        email: mockUser.email,
      }),
    ).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      hashPassword: mockUser.hashPassword,
    });
  });

  it("should return user's firstName, lastName, birthDate, avatarUrl, email and reviews", async () => {
    expect(
      await service.getUserProfile({
        userId: mockUser.id,
      }),
    ).toEqual(mockUserProfile);
  });

  it('should delete user and return message', async () => {
    expect(
      await service.remove({
        userId: mockUser.id,
      }),
    ).toEqual({ message: 'User deleted successfully' });
  });

  it("should add user's avatar and return message", async () => {
    expect(
      await service.updateUserAvatar({
        userId: mockUser.id,
        fileName: '',
        file: Buffer.from(''),
      }),
    ).toEqual({ message: "User's avatar updated" });
  });
});
