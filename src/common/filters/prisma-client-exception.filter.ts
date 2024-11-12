import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unknown database error occurred';

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = 'A record with this value already exists.';
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid reference for a foreign key field.';
        break;
      case 'P2025':
        // Record not found
        status = HttpStatus.NOT_FOUND;
        message = 'The requested record was not found.';
        break;
      case 'P2014':
        // Nested connect violation
        status = HttpStatus.CONFLICT;
        message = 'Nested record operation violates a unique constraint.';
        break;
      case 'P2000':
        // Value out of range
        status = HttpStatus.BAD_REQUEST;
        message =
          'A provided value is out of the allowed range for this field.';
        break;
      default:
        // Generic server error if an unhandled Prisma error code is encountered
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'An unexpected database error occurred.';
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: 'Database Error',
      details: exception.meta, // Optional: Prisma error metadata
    });
  }
}
