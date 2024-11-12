import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { dbConfig } from '../configs';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(dbConfig)],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
