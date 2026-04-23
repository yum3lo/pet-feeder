import { forwardRef, Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { FeedingModule } from '../feeding/feeding.module';
import { DevicesModule } from '../devices/devices.module';
import { RecognitionModule } from '../recognition/recognition.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    forwardRef(() => FeedingModule),
    DevicesModule,
    RecognitionModule,
    NotificationsModule,
  ],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}