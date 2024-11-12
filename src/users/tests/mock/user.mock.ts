import { Role, User } from '@prisma/client';

export const mockResponseMessage = {
  message: 'Any message',
};

export const mockUser: Omit<User, 'createdAt' | 'updatedAt'> = {
  id: '8427048d-5361-4deb-b41a-3464bd27d6db',
  firstName: 'John',
  lastName: 'Doe',
  birthDate: new Date('1990-01-01'),
  email: 'email@example.com',
  hashPassword: 'hashPassword',
  hashRefreshToken: 'hashRefreshToken',
  avatarUrl: null,
  role: Role.USER,
};

export const mockUserProfile = {
  firstName: mockUser.firstName,
  lastName: mockUser.lastName,
  birthDate: mockUser.birthDate,
  avatarUrl: mockUser.avatarUrl,
  purchases: [],
  reviews: [],
};

export const mockUsersService = {
  getUserProfile: jest.fn(() => mockUserProfile),
  updateUserProfile: jest.fn(() => mockResponseMessage),
  remove: jest.fn(() => mockResponseMessage),
  updateUserAvatar: jest.fn(() => mockResponseMessage),
  findUniqueByEmail: jest.fn(() => mockUserProfile),
};
