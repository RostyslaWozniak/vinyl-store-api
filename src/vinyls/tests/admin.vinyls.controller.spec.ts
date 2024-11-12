import { Test, TestingModule } from '@nestjs/testing';
import { AdminVinylsController } from '../controllers';
import { AdminVinylsService } from '../services';
import { CreateVinylDto, UpdateVinylDto } from '../dto';
import { mockVinyl } from './mock/vinyls.mock';

describe('AdminVinylsController', () => {
  let controller: AdminVinylsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminVinylsController],
      providers: [
        {
          provide: AdminVinylsService,
          useValue: {
            create: jest
              .fn()
              .mockResolvedValue({ message: 'Vinyl created successfully' }),
            update: jest
              .fn()
              .mockResolvedValue({ message: 'Vinyl updated successfully' }),
            remove: jest.fn(),
            uploadVinylImage: jest
              .fn()
              .mockResolvedValue({ message: 'Image uploaded successfully!' }),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminVinylsController>(AdminVinylsController);
  });

  it('should create new vinyl and return message', async () => {
    expect(await controller.create({} as CreateVinylDto)).toEqual({
      message: 'Vinyl created successfully',
    });
  });
  it('should update vinyl and return message', async () => {
    expect(await controller.update(mockVinyl.id, {} as UpdateVinylDto)).toEqual(
      {
        message: 'Vinyl updated successfully',
      },
    );
  });
  it('should remove vinyl and return void', async () => {
    expect(await controller.remove(mockVinyl.id)).toEqual(undefined);
  });

  it('should upload vinyl image and return message', async () => {
    expect(
      await controller.uploadVinylImage(
        {} as Express.Multer.File,
        mockVinyl.id,
      ),
    ).toEqual({ message: 'Image uploaded successfully!' });
  });
});
