import { ApiProperty } from '@nestjs/swagger';
import { CreateVinylDto } from '../../vinyls/dto';

export class PurchaseResponseDto {
  @ApiProperty({
    description: 'The vinyl associated with the purchase',
    type: CreateVinylDto,
  })
  vinyl: CreateVinylDto;
}
