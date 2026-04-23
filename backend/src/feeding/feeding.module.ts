import { Module, forwardRef } from '@nestjs/common';
import { MqttModule } from '../mqtt/mqtt.module';
import { FeedingService } from './feeding.service';
import { FeedingController } from './feeding.controller';

@Module({
  imports: [forwardRef(() => MqttModule)],
  providers: [FeedingService],
  controllers: [FeedingController],
  exports: [FeedingService],
})
export class FeedingModule {}