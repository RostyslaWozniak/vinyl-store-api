import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers';
import { AuthService } from '../services';
import { AuthDto } from '../dto';
import { mockAuthService, mockTokens } from './mock';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should SIGN_UP user and return tokens', async () => {
    expect(await controller.signUp({} as AuthDto)).toEqual(mockTokens);
  });
  it('should LOGIN user and return tokens', async () => {
    expect(await controller.login({} as AuthDto)).toEqual(mockTokens);
  });
  it('should refresh tokens and return them', async () => {
    expect(await controller.refreshTokens('userId', 'refreshToken')).toEqual(
      mockTokens,
    );
  });
  it('should logout user and return void', async () => {
    expect(await controller.logout('userId')).toEqual(undefined);
  });
});
