import { Module } from '@nestjs/common';
import { AdminVinylsController, VinylsController } from './controllers';
import { AdminVinylsService, VinylsService } from './services';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [VinylsController, AdminVinylsController],
  providers: [VinylsService, AdminVinylsService],
  exports: [VinylsService],
})
export class VinylsModule {}
