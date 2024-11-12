import { registerAs } from '@nestjs/config';

export const googleOauthConfig = registerAs('googleOAuth', () => ({
  clinetID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}));