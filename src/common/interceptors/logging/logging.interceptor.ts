import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LogService } from '../../../log/services';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url } = request;

    return next.handle().pipe(
      tap(() => {
        this.logService.info({
          entity: url,
          method,
          statusCode: response.statusCode,
          message: 'Request completed successfully',
        });
      }),
      catchError((error) => {
        this.logService.error({
          entity: url,
          method,
          statusCode: error.status || 500,
          message: error.message || 'Internal server error',
        });
        throw error;
      }),
    );
  }
}
