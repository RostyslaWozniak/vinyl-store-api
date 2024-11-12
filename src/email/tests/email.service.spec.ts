import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../services';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resendConfig } from '../../configs';
import { ResendService } from 'nestjs-resend';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [resendConfig],
          cache: true,
        }),
      ],
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation(() => ({
              resendApiKey: 'resendApiKey',
              emailDomain: 'emailDomain',
            })),
          },
        },
        {
          provide: ResendService,
          useValue: {
            send: jest.fn(() => ({
              data: { id: expect.any(String) },
              error: null,
            })),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', async () => {
    expect(
      await service.sendTextEmail({
        to: 'to',
        subject: 'subject',
        text: 'text',
      }),
    ).toEqual({
      data: { id: expect.any(String) },
      error: null,
    });
  });
});
