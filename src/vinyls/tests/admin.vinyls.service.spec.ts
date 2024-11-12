import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminVinylsService } from '../services';
import { CreateVinylDto, UpdateVinylDto } from '../../vinyls/dto';
import { mockPrismaService } from '../../prisma/tests/mock/prisma-service.mock';
import { UploadService } from '../../upload/service';
import { mockVinyl } from './mock/vinyls.mock';

describe('VinylsService', () => {
  let service: AdminVinylsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminVinylsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService(),
        },
        {
          provide: UploadService,
          useValue: {
            upload: jest.fn().mockResolvedValue('https://example.com/avatar'),
          },
        },
      ],
    }).compile();

    service = module.get<AdminVinylsService>(AdminVinylsService);
  });

  it('should create new vinyl record and return message', async () => {
    expect(await service.create({} as CreateVinylDto)).toEqual({
      message: 'Vinyl created successfully',
    });
  });

  it('should return one vinyl', async () => {
    expect(await service.getVinylById({ vinylId: mockVinyl.id })).toEqual(
      mockVinyl,
    );
  });

  it('should update vinyl and return message', async () => {
    expect(
      await service.update({ vinylId: mockVinyl.id }, {} as UpdateVinylDto),
    ).toEqual({
      message: 'Vinyl updated successfully',
    });
  });

  it('should remove vinyl and return void', async () => {
    expect(await service.remove({ vinylId: mockVinyl.id })).toEqual(undefined);
  });

  it('should upload vinyl image and return message', async () => {
    expect(
      await service.uploadVinylImage({
        vinylId: mockVinyl.id,
        fileName: '',
        file: Buffer.from(''),
      }),
    ).toEqual({
      message: 'Image uploaded successfully!',
    });
  });
});
