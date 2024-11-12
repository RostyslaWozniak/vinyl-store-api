import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  rtSecret: process.env.REFRESH_TOKEN_SECRET,
  atSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
}));
