import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVinylDto {
  @ApiProperty({
    description: 'Name of the vinyl record',
    example: 'Name of the vinyl record',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Name of the author or artist',
    example: 'Name of the author or artist',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  authorName: string;

  @ApiProperty({
    description: 'Description of the vinyl record',
    example: 'Description of the vinyl record',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Price of the vinyl record',
    example: 9.99,
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: Decimal;

  @ApiProperty({
    description: 'Cover image url of the vinyl record',
    example: 'Cover image url of the vinyl record',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  coverUrl?: string;
}
