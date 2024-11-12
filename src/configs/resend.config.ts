import { registerAs } from '@nestjs/config';

export const resendConfig = registerAs('resendConfig', () => ({
  resendApiKey: process.env.RESEND_API_KEY,
  emailDomain: process.env.EMAIL_DOMAIN,
}));
