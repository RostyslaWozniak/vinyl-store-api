import { AuthGuard } from '@nestjs/passport';
import { REFRESH_TOKEN_STRATEGY_NAME } from '../../auth/strategies';

export class RefreshTokenGuard extends AuthGuard(REFRESH_TOKEN_STRATEGY_NAME) {
  constructor() {
    super();
  }
}
