import { prisma } from './';
import { userRecords } from './data';
import * as bcrypt from 'bcrypt';

export async function seedUsers() {
  console.log('Seeding users...');

  // Hash passwords before seeding
  const usersWithHashedPasswords = await Promise.all(
    userRecords.map(async (user) => {
      const hashPassword = await bcrypt.hash(user.password, 10);
      return { email: user.email, hashPassword: hashPassword, role: user.role };
    }),
  );

  // seeding users
  await prisma.user.createMany({ data: usersWithHashedPasswords });
  console.log('Users seeded successfully.');
}
