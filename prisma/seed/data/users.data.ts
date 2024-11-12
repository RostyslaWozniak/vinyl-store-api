import { Role } from '@prisma/client';

export const userRecords = [
  {
    email: 'admin@gmail.com',
    password: '12345678',
    role: Role.ADMIN,
  },
  {
    email: 'user@gmail.com',
    password: '12345678',
  },
];
