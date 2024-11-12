import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from '../services';
import { GetCurrentUserId } from '../../auth/decorators';
import { UpdateUserDto, UserResponseDto } from '../dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@ApiTags('Users')
@ApiHeader({ name: 'Authorization', required: true })
@ApiBearerAuth()
@ApiBadRequestResponse({
  description: 'Bad request',
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get auth user profile information' })
  @ApiOkResponse({
    type: UserResponseDto,
  })
  async getUserProfile(
    @GetCurrentUserId() userId: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.getUserProfile({ userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch('/profile')
  @ApiOperation({ summary: "Update auth user's profile" })
  @ApiOkResponse({
    schema: {
      example: {
        message: "User's profile updated",
      },
    },
  })
  updateUserProfile(
    @GetCurrentUserId() userId: string,
    @Body() dto: UpdateUserDto,
  ): Promise<{ message: string }> {
    return this.usersService.updateUserProfile({ userId, dto });
  }

  @Delete('/profile')
  @ApiOperation({ summary: "Delete auth user's profile" })
  @ApiNoContentResponse()
  remove(@GetCurrentUserId() userId: string): Promise<{ message: string }> {
    return this.usersService.remove({ userId });
  }

  @Post('profile/avatar')
  @ApiOperation({ summary: "Update or add user's avatar" })
  @ApiOkResponse({
    schema: {
      example: {
        message: "User's avatar updated",
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @GetCurrentUserId() userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<{ message: string }> {
    return await this.usersService.updateUserAvatar({
      userId,
      fileName: file.originalname,
      file: file.buffer,
    });
  }
}
