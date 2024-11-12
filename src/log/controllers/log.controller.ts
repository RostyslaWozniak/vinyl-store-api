import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { LogService } from '../services';
import { GetQueryParams } from '../../common/decorators';
import { QueryParams } from '../../types';
import { RolesGuard } from '../../auth/guards';
import { Roles } from '../../auth/decorators/roles.decorator';
import { LogResponseDto } from '../dto';

@Controller('logs')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('System Logs (Admin)')
@ApiHeader({ name: 'Authorization', required: true })
@ApiBearerAuth()
@ApiBadRequestResponse({
  description: 'Bad request',
})
@ApiNotFoundResponse({
  description: 'Not found',
})
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all system logs' })
  @ApiOkResponse({ type: [LogResponseDto] })
  async getLogs(
    @GetQueryParams() queryParams: QueryParams,
  ): Promise<LogResponseDto[]> {
    return await this.logService.getLogs(queryParams);
  }
}
