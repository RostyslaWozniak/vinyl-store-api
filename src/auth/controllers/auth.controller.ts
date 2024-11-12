import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from '../services';
import { GoogleOauthGuard, RefreshTokenGuard } from '../guards';
import { GetCurrentUser, GetCurrentUserId, Public } from '../decorators';
import { AuthDto, GoogleAuthDto, Tokens } from '../dto';

@Controller('auth')
@ApiTags('Authentication')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiCreatedResponse({
    type: Tokens,
  })
  signUp(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signUp(dto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiOkResponse({
    type: Tokens,
  })
  login(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({
    type: Tokens,
  })
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({ summary: 'Login or sign up with Google' })
  async googleAuthCallback(
    @Req() req: Request & { user: GoogleAuthDto },
    @Res() res: Response,
  ): Promise<Tokens> {
    const tokens = await this.authService.loginGoogle(req.user);
    res.redirect(
      `${process.env.BASE_URL}/api/profile?token=${tokens.accessToken}`,
    );
    return tokens;
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout an existing user' })
  @ApiNoContentResponse()
  async logout(@GetCurrentUserId() userId: string): Promise<void> {
    await this.authService.logout(userId);
  }
}
