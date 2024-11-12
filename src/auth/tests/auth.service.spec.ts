import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services';
import { UsersService } from '../../users/services';
import { mockUsersService } from '../../users/tests/mock/user.mock';
import { PrismaService } from '../../prisma/prisma.service';
import { jwtConfig } from '../../configs';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { mockPrismaService } from '../../prisma/tests/mock/prisma-service.mock';

describe('AuthService', () => {
  let service: AuthService;

  const mockJwtConfig = {
    rtSecret: 'refresh_token_secret',
    atSecret: 'access_token_secret',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [jwtConfig],
          cache: true,
        }),
      ],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService(),
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn(() => 'accessToken') },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'jwt') {
                return mockJwtConfig;
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should logout user and return void', async () => {
    expect(await service.logout('userId')).toEqual(undefined);
  });
});
