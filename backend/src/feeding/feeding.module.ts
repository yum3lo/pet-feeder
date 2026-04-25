import { Module, forwardRef } from '@nestjs/common';
import { MqttModule } from '../mqtt/mqtt.module';
import { FeedingService } from './feeding.service';
import { FeedingController } from './feeding.controller';
import { RecognitionModule } from 'src/recognition/recognition.module';

@Module({
  imports: [
    forwardRef(() => MqttModule),
    RecognitionModule,
  ],
  providers: [FeedingService],
  controllers: [FeedingController],
  exports: [FeedingService],
})
export class FeedingModule {}