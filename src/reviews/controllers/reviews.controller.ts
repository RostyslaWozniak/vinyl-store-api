import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ReviewsService } from '../services';
import { GetCurrentUserId, Public } from '../../auth/decorators';
import { CreateReviewDto } from '../dto';
import { GetQueryParams } from '../../common/decorators';
import { QueryParams } from '../../types';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { VinylReviewDto } from '../dto/vinyl-review.dto';

@Controller('vinyls/:vinylId/reviews')
@ApiTags('Reviews')
@ApiBadRequestResponse({
  description: 'Bad request',
})
@ApiNotFoundResponse({
  description: 'Not found',
})
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all reviews for a vinyl' })
  @ApiOkResponse({
    type: VinylReviewDto,
  })
  async getAll(
    @Param('vinylId', ParseUUIDPipe) vinylId: string,
    @GetQueryParams() queryParams: QueryParams,
  ): Promise<VinylReviewDto[]> {
    return await this.reviewsService.getAll(vinylId, queryParams);
  }

  @Post()
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a review for a vinyl' })
  @ApiOkResponse({
    schema: {
      example: { message: 'Review added successfully' },
    },
  })
  async create(
    @Param('vinylId', ParseUUIDPipe) vinylId: string,
    @GetCurrentUserId() userId: string,
    @Body() dto: CreateReviewDto,
  ): Promise<{
    message: string;
  }> {
    return await this.reviewsService.create({ userId, vinylId, ...dto });
  }
}
