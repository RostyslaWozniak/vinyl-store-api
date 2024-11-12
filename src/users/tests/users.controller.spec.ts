import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers';
import { UsersService } from '../services';
import {
  mockUserProfile,
  mockUsersService,
  mockResponseMessage,
} from './mock/user.mock';
import { AuthGuard } from '@nestjs/passport';
import { mockAuthGuard } from '../../auth/tests/mock';
import { UpdateUserDto } from '../dto';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should return user's profile", async () => {
    expect(await controller.getUserProfile('mockUserId')).toEqual(
      mockUserProfile,
    );
  });

  it("should updates user's profile", async () => {
    expect(
      await controller.updateUserProfile('mockUserId', {} as UpdateUserDto),
    ).toEqual(mockResponseMessage);
  });

  it("should return user's profile", async () => {
    expect(await controller.remove('mockUserId')).toEqual(mockResponseMessage);
  });

  it("should upload user's profile avatar", async () => {
    expect(
      await controller.uploadAvatar('mockUserId', {} as Express.Multer.File),
    ).toEqual(mockResponseMessage);
  });
});
