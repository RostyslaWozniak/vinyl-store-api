import { HttpStatus } from '@nestjs/common';

export class LogEntryDto {
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  method: string;
  statusCode: HttpStatus;
  entity: string;
  message: string;
}
