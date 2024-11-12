import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards';
import { UploadModule } from './upload/upload.module';
import { VinylsModule } from './vinyls/vinyls.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PurchasesModule } from './purchases/purchases.module';
import { EmailModule } from './email/email.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    UsersModule,
    UploadModule,
    VinylsModule,
    ReviewsModule,
    PurchasesModule,
    EmailModule,
    LogModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
