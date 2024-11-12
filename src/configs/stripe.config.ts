import { registerAs } from '@nestjs/config';

export const stripeConfig = registerAs('stripeConfig', () => ({
  stripeApiKey: process.env.STRIPE_API_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
}));
