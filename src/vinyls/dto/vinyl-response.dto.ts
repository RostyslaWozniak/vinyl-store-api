import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class VinylResponseDto {
  @ApiProperty({
    description: 'Vinyl name',
    example: 'Vinyl Name',
  })
  name: string;

  @ApiProperty({
    description: 'Vinyl author name',
    example: 'Vinyl Author Name',
  })
  authorName: string;

  @ApiProperty({
    description: 'Vinyl description',
    example: 'Vinyl Description',
  })
  description: string;

  @ApiProperty({
    type: 'number',
    format: 'float',
    example: 9.99,
  })
  price: Decimal;

  @ApiProperty({
    type: 'number',
    description: 'Average score of the vinyl',
    example: 4.5,
  })
  averageScore: number;

  @ApiProperty({
    type: 'string',
    description: 'Cover image url',
    example: 'https://example.com/cover.jpg',
  })
  coverUrl: string;
}
