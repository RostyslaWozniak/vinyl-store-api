import { ApiProperty } from '@nestjs/swagger';

export class LogResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the log entry',
    example: 'Unique identifier of the log entry',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Log level, indicating the severity of the log entry',
    example: 'INFO | ERROR',
    type: String,
  })
  level: string;

  @ApiProperty({
    description: 'HTTP method associated with the log entry',
    example: 'GET | POST | PUT | PATCH | DELETE',
    type: String,
  })
  method: string;

  @ApiProperty({
    description: 'HTTP status code returned by the request',
    example: '200 | 404 | 500',
    type: String,
  })
  statusCode: string;

  @ApiProperty({
    description: 'The path or resource that the log entry is associated with',
    example: '/api/v1/vinyls | Vinyl',
    type: String,
  })
  entity: string;

  @ApiProperty({
    description: 'Detailed message describing the log entry',
    example: 'User successfully created',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp when the log entry was created',
    example: '2023-11-08T12:34:56Z',
    type: Date,
  })
  createdAt: Date;
}
