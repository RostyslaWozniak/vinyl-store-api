import { Module } from '@nestjs/common';
import { EmailService } from './services';
import { ResendModule } from 'nestjs-resend';
import { ConfigModule } from '@nestjs/config';
import { resendConfig } from 'src/configs';

@Module({
  imports: [
    ResendModule.forRoot({
      apiKey: process.env.RESEND_API_KEY,
    }),
    ConfigModule.forFeature(resendConfig),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
