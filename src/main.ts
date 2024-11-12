import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './configs';
import { LoggingInterceptor } from './common/interceptors/logging';
import { LogService } from './log/services';
import { PrismaClientExceptionFilter } from './common/filters';

const DEFAULT_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  // add prefix api
  app.setGlobalPrefix('api');

  // add swagger
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  // add global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // add exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // add global interceptor
  app.useGlobalInterceptors(new LoggingInterceptor(app.get(LogService)));

  // listen server
  await app.listen(process.env.PORT ?? DEFAULT_PORT);
}
bootstrap();
