import { prisma } from '..';

export const clearDatabase = async () => {
  console.log('Clearing database...');

  await Promise.all([
    prisma.user.deleteMany(),
    prisma.vinyl.deleteMany(),
    prisma.review.deleteMany(),
    prisma.purchase.deleteMany(),
    prisma.systemLog.deleteMany(),
  ]);

  console.log('Database cleared successfully.');
};
