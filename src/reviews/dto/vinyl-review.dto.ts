import { ApiProperty } from '@nestjs/swagger';

export class ReviewUserDto {
  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  lastName: string;
}

export class VinylReviewDto {
  @ApiProperty({
    description: 'Score of the vinyl review, ranging from 1 to 5',
    example: 4,
  })
  score: number;

  @ApiProperty({
    description: 'Review comment',
    example: 'Review comment',
  })
  comment: string;

  @ApiProperty({
    description: 'Details of the user who submitted the review',
    type: ReviewUserDto,
  })
  user: ReviewUserDto;
}
