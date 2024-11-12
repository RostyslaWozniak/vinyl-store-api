import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
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
import { GetCurrentUserId, Public } from '../../auth/decorators';
import { PurchasesService } from '../services';
import { Request } from 'express';

import { PurchaseResponseDto } from '../dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';

@Controller('purchases')
@ApiTags('Purchases')
@ApiBadRequestResponse({
  description: 'Bad request',
})
@ApiNotFoundResponse({
  description: 'Not found',
})
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get auth user own purchases' })
  @ApiOkResponse({
    description: 'Purchase details',
    type: [PurchaseResponseDto],
  })
  async getPurchases(
    @GetCurrentUserId() userId: string,
  ): Promise<PurchaseResponseDto[]> {
    return await this.purchasesService.getUserPurchases({ userId });
  }

  @Get(':productId/payment')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment intent' })
  @ApiOkResponse({
    description: 'Stripe client secret and metadata',
    type: PaymentResponseDto,
  })
  async buyProduct(
    @GetCurrentUserId() userId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<PaymentResponseDto> {
    return await this.purchasesService.buyProduct({
      userId,
      productId,
    });
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({
    summary:
      'Webhook from stripe, will add purchase to db and send email to customer',
  })
  async webhook(@Req() req: Request): Promise<void> {
    return await this.purchasesService.checkDataFromStripe(req);
  }
}
