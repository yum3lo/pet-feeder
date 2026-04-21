import { Module } from '@nestjs/common';
import { FeedingService } from './feeding.service';
import { FeedingController } from './feeding.controller';

@Module({
  providers: [FeedingService],
  controllers: [FeedingController],
  exports: [FeedingService],
})
export class FeedingModule {}