import { Controller, Get } from '@nestjs/common';
import { VinylsService } from '../services';
import { Public } from '../../auth/decorators';
import { QueryParams } from '../../types';
import { GetQueryParams } from '../../common/decorators';
import { VinylResponseDto } from '../dto/';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiQueryParams } from '../../common/decorators/api-query-params.decorator';

@Controller('vinyls')
@ApiTags('Vinyls')
@ApiBadRequestResponse({
  description: 'Bad request',
})
@ApiNotFoundResponse({
  description: 'Not found',
})
export class VinylsController {
  constructor(private readonly vinylsService: VinylsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get vinyl list' })
  @ApiQueryParams()
  @ApiOkResponse({
    description: 'List of vinyls',
    type: [VinylResponseDto],
  })
  getVinylList(
    @GetQueryParams() queryParams: QueryParams,
  ): Promise<VinylResponseDto[]> {
    return this.vinylsService.getVinylList(queryParams);
  }
}
