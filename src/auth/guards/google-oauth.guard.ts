import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GOOGLE_STRATEGY_NAME } from '../strategies';

@Injectable()
export class GoogleOauthGuard extends AuthGuard(GOOGLE_STRATEGY_NAME) {}
