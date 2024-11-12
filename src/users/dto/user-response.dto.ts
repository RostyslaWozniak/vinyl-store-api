import { ApiProperty } from '@nestjs/swagger';
import { Review, Vinyl } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class UserResponseDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User birth date',
    example: '1990-01-01',
  })
  birthDate: Date;

  @ApiProperty({
    description: 'User avatar url',
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl: string;

  @ApiProperty({
    description: 'User reviews',
    example: [
      {
        score: 5,
        comment: 'Great vinyl!',
        vinyl: {},
      },
    ],
  })
  reviews: Pick<Review & { vinyl: Vinyl }, 'score' | 'comment'>[];

  @ApiProperty({
    description: "User's purchases",
    example: [
      {
        vinyl: {
          name: 'Vinyl Name',
          authorName: 'Vinyl Author Name',
          description: 'Vinyl Description',
          price: 9.99,
          coverUrl: 'https://example.com/vinyl.jpg',
        },
      },
    ],
  })
  purchases: {
    vinyl: {
      name: string;
      authorName: string;
      description: string;
      price: Decimal;
      coverUrl: string;
    };
  }[];
}
