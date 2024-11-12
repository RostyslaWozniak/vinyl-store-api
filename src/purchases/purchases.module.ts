import { Module } from '@nestjs/common';
import { PurchasesController } from './controllers';
import { PurchasesService } from './services';
import { stripeConfig } from 'src/configs';
import { ConfigModule } from '@nestjs/config';
import { VinylsModule } from 'src/vinyls/vinyls.module';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    ConfigModule.forFeature(stripeConfig),
    VinylsModule,
    UsersModule,
    EmailModule,
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
