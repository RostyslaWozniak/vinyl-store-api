import { Module } from '@nestjs/common';
import { LogService } from './services';
import { LogController } from './controllers';

@Module({
  providers: [LogService],
  exports: [LogService],
  controllers: [LogController],
})
export class LogModule {}
