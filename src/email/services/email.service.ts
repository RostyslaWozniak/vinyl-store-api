import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CreateEmailResponse, ResendService } from 'nestjs-resend';
import { resendConfig } from '../../configs';
import { SendTextEmail } from '../types';

@Injectable()
export class EmailService {
  constructor(
    @Inject(resendConfig.KEY)
    private resendConfigKeys: ConfigType<typeof resendConfig>,
    private readonly resendService: ResendService,
  ) {}

  async sendTextEmail({
    to,
    subject,
    text,
  }: SendTextEmail): Promise<CreateEmailResponse> {
    const result = await this.resendService.send({
      from: this.resendConfigKeys.emailDomain,
      to,
      subject,
      text,
    });
    return result;
  }
}
