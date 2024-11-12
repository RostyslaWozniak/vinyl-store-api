import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AdminReviewsService } from '../services/admin.reviews.service';

@Controller('admin/reviews')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('Reviews (Admin)')
@ApiHeader({ name: 'Authorization', required: true })
@ApiBearerAuth()
@ApiBadRequestResponse({
  description: 'Bad request',
})
@ApiNotFoundResponse({
  description: 'Not found',
})
export class AdminReviewsController {
  constructor(private readonly adminReviewsService: AdminReviewsService) {}

  @Delete(':reviewId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a review by admin' })
  @ApiNoContentResponse()
  async remove(
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ): Promise<void> {
    return await this.adminReviewsService.remove({ reviewId });
  }
}
