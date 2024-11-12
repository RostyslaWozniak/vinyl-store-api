import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiPropertyOptional({
    description: 'Optional comment for the review',
    example: 'Optional comment for the review',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({
    description: 'Score for the review, ranging from 1 to 5',
    example: 4,
    minimum: 1,
    maximum: 5,
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}
