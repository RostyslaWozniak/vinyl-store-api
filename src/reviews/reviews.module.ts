import { Module } from '@nestjs/common';
import { AdminReviewsController, ReviewsController } from './controllers';
import { AdminReviewsService, ReviewsService } from './services';
import { VinylsModule } from 'src/vinyls/vinyls.module';

@Module({
  imports: [VinylsModule],
  controllers: [ReviewsController, AdminReviewsController],
  providers: [ReviewsService, AdminReviewsService],
})
export class ReviewsModule {}
