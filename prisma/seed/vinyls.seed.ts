import { prisma } from './';
import { vinylRecords } from './data';

export async function seedVinyls() {
  console.log('Seeding vinyls...');

  await prisma.vinyl.createMany({
    data: vinylRecords,
  });

  console.log('Vinyls seeded successfully.');
}
