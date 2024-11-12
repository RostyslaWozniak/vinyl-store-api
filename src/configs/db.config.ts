import { registerAs } from '@nestjs/config';

export const dbConfig = registerAs('dbConfig', () => ({
  dbUrl: process.env.POSTGRES_PRISMA_URL,
}));
