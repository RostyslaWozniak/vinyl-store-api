import { PrismaClient } from '@prisma/client';
import { seedUsers } from './users.seed';
import { seedVinyls } from './vinyls.seed';
import { clearDatabase } from './data/clear-database.seed';

export const prisma = new PrismaClient();

async function main() {
  try {
    await clearDatabase();

    await seedUsers();

    await seedVinyls();

    console.log('Database seeding completed successfully.');
  } catch (err) {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
