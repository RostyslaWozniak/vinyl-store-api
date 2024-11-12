import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AdminVinylsService } from '../services';
import { CreateVinylDto, UpdateVinylDto } from '../dto';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin/vinyls')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('Vinyls (Admin)')
@ApiHeader({ name: 'Authorization', required: true })
@ApiBearerAuth()
@ApiBadRequestResponse({
  description: 'Bad request',
})
@ApiNotFoundResponse({
  description: 'Not found',
})
export class AdminVinylsController {
  constructor(private readonly adminVinylsService: AdminVinylsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new vinyl by admin' })
  @ApiCreatedResponse({
    schema: {
      example: {
        message: 'Vinyl added successfully',
      },
    },
  })
  create(@Body() createVinylDto: CreateVinylDto): Promise<{ message: string }> {
    return this.adminVinylsService.create(createVinylDto);
  }

  @Patch(':vinylId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a vinyl by admin' })
  @ApiOkResponse({
    schema: {
      example: { message: 'Vinyl updated successfully' },
    },
  })
  update(
    @Param('vinylId', ParseUUIDPipe) vinylId: string,
    @Body() updateVinylDto: UpdateVinylDto,
  ): Promise<{ message: string }> {
    return this.adminVinylsService.update({ vinylId }, updateVinylDto);
  }

  @Delete(':vinylId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a vinyl by admin' })
  @ApiNoContentResponse()
  async remove(
    @Param('vinylId', ParseUUIDPipe) vinylId: string,
  ): Promise<void> {
    return await this.adminVinylsService.remove({ vinylId });
  }

  @Post(':vinylId/image')
  @ApiOperation({ summary: 'Update or add vinyl cover image' })
  @ApiOkResponse({
    schema: {
      example: {
        message: "User's avatar updated",
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadVinylImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('vinylId', ParseUUIDPipe) vinylId: string,
  ): Promise<{ message: string }> {
    return await this.adminVinylsService.uploadVinylImage({
      fileName: file.originalname,
      file: file.buffer,
      vinylId,
    });
  }
}
