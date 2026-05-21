import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { FeedingService } from '../feeding/feeding.service';
import { DevicesService } from '../devices/devices.service';
import { RecognitionService } from '../recognition/recognition.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private client!: mqtt.MqttClient;

  // tracking pending feeding timeouts per device
  // if no feeding result arrives within 60s, marking as failed
  private feedingTimeouts = new Map<string, NodeJS.Timeout>();
  private lowFoodAlertCooldowns = new Map<string, number>();
  private freeFeedingCooldowns = new Map<number, number>(); // petId -> last fed timestamp
  private recognitionWarmupCounts = new Map<string, number>(); // deviceId -> results seen since detection enabled

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private feedingService: FeedingService,
    private devicesService: DevicesService,
    private recognitionService: RecognitionService,
    private notificationsService: NotificationsService,
  ) {}

  onModuleInit() {
    const brokerUrl = this.config.get('MQTT_BROKER_URL');
    const port = this.config.get<number>('MQTT_PORT', 8883);
    const username = this.config.get('MQTT_USERNAME');
    const password = this.config.get('MQTT_PASSWORD');

    this.client = mqtt.connect(`mqtts://${brokerUrl}:${port}`, {
      username,
      password,
      clientId: `backend_${Date.now()}`,
      clean: false,
      reconnectPeriod: 5000,
      connectTimeout: 10000,
    });

    this.client.on('connect', () => {
      this.logger.log('Connected to HiveMQ broker.');
      this.subscribeToTopics();
    });

    this.client.on('disconnect', () => {
      this.logger.warn('Disconnected from broker. Reconnecting...');
    });

    this.client.on('error', (err) => {
      this.logger.error(`MQTT error: ${err.message}`);
    });

    this.client.on('message', (topic, payload) => {
      this.handleMessage(topic, payload);
    });

    // injecting this service into FeedingService to avoid circular dependency
    this.feedingService.setMqttService(this);
  }

  onModuleDestroy() {
    this.client.end();
  }

  // ── Subscriptions ─────────────────────────────────────────

  private subscribeToTopics() {
    const topics = [
      'feeder/+/results/feeding',
      'feeder/+/results/photos',
      'feeder/+/data/movement_image',
      'feeder/+/data/container_weight',
      'feeder/+/status/heartbeat',
      'feeder/+/status/error',
    ];

    topics.forEach((topic) => {
      this.client.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          this.logger.error(`Failed to subscribe to ${topic}: ${err.message}`);
        } else {
          this.logger.log(`Subscribed to ${topic}`);
        }
      });
    });
  }

  // ── Message router ────────────────────────────────────────

  private async handleMessage(topic: string, payload: Buffer) {
    let data: any;
    try {
      data = JSON.parse(payload.toString());
    } catch {
      this.logger.warn(`Could not parse message on ${topic}`);
      return;
    }

    this.logger.debug(`Message on ${topic}`);

    // extracting deviceId from topic -> format: feeder/{deviceId}/...
    const deviceId = topic.split('/')[1];
    if (!deviceId) return;

    if (topic.endsWith('/results/feeding')) {
      await this.handleFeedingResult(deviceId, data);
    } else if (topic.endsWith('/results/photos')) {
      await this.handleTrainingPhotos(deviceId, data);
    } else if (topic.endsWith('/data/movement_image')) {
      await this.handleMovementImage(deviceId, data);
    } else if (topic.endsWith('/data/container_weight')) {
      await this.handleContainerWeight(deviceId, data);
    } else if (topic.endsWith('/status/heartbeat')) {
      await this.handleHeartbeat(deviceId, data);
    } else if (topic.endsWith('/status/error')) {
      await this.handleError(deviceId, data);
    }
  }

  // ── Message handlers ──────────────────────────────────────

  private async handleFeedingResult(deviceId: string, data: any) {
    this.logger.log(`Feeding result from ${deviceId}: ${JSON.stringify(data)}`);

    // canceling the timeout
    this.clearFeedingTimeout(deviceId);

    const {
      scheduledPetId,
      dispensedGrams,
      consumedGrams,
      leftoverGrams,
    } = data;

    const log = await this.feedingService.handleFeedingResult(
      deviceId,
      scheduledPetId ?? null,
      dispensedGrams ?? 0,
      consumedGrams ?? 0,
      leftoverGrams ?? 0,
    );

    // notifying the owner
    const userId = await this.devicesService.getUserIdByDeviceId(deviceId);
    if (userId) {
      const petName = log?.petId
        ? await this.getPetName(log.petId)
        : 'Your pet';

      const message = `${petName} has eaten ${consumedGrams}g.`;

      await this.notificationsService.create(userId, message, 'feeding_complete');
    }
  }

  private async handleTrainingPhotos(deviceId: string, data: any) {
    const { petId, photos, batchIndex, totalBatches } = data;
    this.logger.log(
      `Training photos batch ${batchIndex + 1}/${totalBatches} ` +
      `for pet ${petId} from ${deviceId}`,
    );

    const result = await this.recognitionService.storeTrainingPhotos(
      petId,
      photos,
      batchIndex,
      totalBatches,
    );

    if (result?.isComplete) {
      const userId = await this.devicesService.getUserIdByDeviceId(deviceId);
      if (userId) {
        this.notificationsService.emit(userId, 'photos_received', { petId });
      }
    }
  }

  private async handleMovementImage(deviceId: string, data: any) {
    const { image } = data;
    if (!image) return;

    const WARMUP_COUNT = 3;
    const seen = this.recognitionWarmupCounts.get(deviceId) ?? WARMUP_COUNT;
    if (seen < WARMUP_COUNT) {
      this.recognitionWarmupCounts.set(deviceId, seen + 1);
      this.logger.debug(`Recognition warmup ${seen + 1}/${WARMUP_COUNT} for ${deviceId} — skipping.`);
      return;
    }

    this.logger.log(`Movement image received from ${deviceId} — running recognition.`);

    const result = await this.recognitionService.recognizePet(deviceId, image);

    // sending recognition result back to Pi
    this.publish(
      `feeder/${deviceId}/results/recognition`,
      {
        petId: result.petId,
        confidence: result.confidence,
      },
    );

    // if pet is on free-feeding mode, log and dispense
    if (result.petId && result.shouldFeed) {
      const FREE_FEEDING_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes
      const lastFed = this.freeFeedingCooldowns.get(result.petId) ?? 0;
      const now = Date.now();

      if (now - lastFed < FREE_FEEDING_COOLDOWN_MS) {
        this.logger.debug(`Pet ${result.petId} was recently free-fed — skipping.`);
      } else {
        const pet = await this.getPetWithSchedule(result.petId);
        if (pet) {
          this.freeFeedingCooldowns.set(result.petId, now);
          await this.feedingService.executeFeeding(
            deviceId,
            result.petId,
            pet.defaultPortionSize,
            'free',
          );
        }
      }
    }
  }

  private async handleContainerWeight(deviceId: string, data: any) {
    const { weightGrams } = data;
    this.logger.debug(`Container weight from ${deviceId}: ${weightGrams}g`);

    await this.devicesService.updateContainerWeight(deviceId, weightGrams);

    const userId = await this.devicesService.getUserIdByDeviceId(deviceId);
    if (!userId) return;

    const LOW_FOOD_THRESHOLD = 100;
    const ALERT_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

    if (weightGrams < LOW_FOOD_THRESHOLD) {
      const lastAlert = this.lowFoodAlertCooldowns.get(deviceId) ?? 0;
      const now = Date.now();

      if (now - lastAlert > ALERT_COOLDOWN_MS) {
        this.logger.warn(`Low food alert for device ${deviceId}: ${weightGrams}g`);
        await this.notificationsService.create(
          userId,
          `Food is running low (${weightGrams}g remaining). Please refill the container.`,
          'low_food',
        );
        this.lowFoodAlertCooldowns.set(deviceId, now);
      }
    } else {
      // resetting cooldown when food is refilled
      this.lowFoodAlertCooldowns.delete(deviceId);
    }
  }

  private async handleHeartbeat(deviceId: string, data: any) {
    if (data.status === 'offline') {
      this.logger.log(`Device ${deviceId} disconnected.`);
      await this.devicesService.markOffline(deviceId);
    } else {
      this.logger.log(`Device ${deviceId} connected.`);
      await this.devicesService.markOnline(deviceId);

      const userId = await this.devicesService.getUserIdByDeviceId(deviceId);
      if (userId) {
        const modelPath = require('path').join(process.cwd(), 'models', `user_${userId}`, 'model.h5');
        const modelExists = require('fs').existsSync(modelPath);
        this.sendDetectionCommand(deviceId, modelExists);
      }
    }
  }

  private async handleError(deviceId: string, data: any) {
    const { errorCode, message } = data;
    this.logger.error(`Error from ${deviceId}: [${errorCode}] ${message}`);

    const userId = await this.devicesService.getUserIdByDeviceId(deviceId);
    if (userId) {
      await this.notificationsService.create(
        userId,
        `Feeder error: ${message}`,
        'error',
      );
    }

    // if feeding was pending and device reports an error, marking it failed
    if (errorCode === 'DISPENSE_ERROR' || errorCode === 'LOW_FOOD' || errorCode === 'MOTOR_STALL') {
      await this.feedingService.markFeedingFailed(deviceId);
    }
  }

  // ── Commands sent to Pi ───────────────────────────────────

  sendDispenseCommand(
    deviceId: string,
    petId: number,
    portionGrams: number,
    logId: number | null,
  ) {
    this.logger.log(
      `Sending dispense command to ${deviceId}: pet=${petId}, portion=${portionGrams}g`,
    );

    this.publish(`feeder/${deviceId}/commands/dispense`, {
      petId: petId,
      portionGrams,
      logId,
    });

    // if no result arrives in 120s, marking feeding as failed
    // (dispensing + eating + 30s stability window can easily exceed 60s)
    this.clearFeedingTimeout(deviceId);
    const timeout = setTimeout(async () => {
      this.logger.warn(`No feeding result from ${deviceId} after 120s.`);
      await this.feedingService.markFeedingFailed(deviceId);

      const userId = await this.devicesService.getUserIdByDeviceId(deviceId);
      if (userId) {
        await this.notificationsService.create(
          userId,
          'A scheduled feeding may have failed. Please check the feeder.',
          'feeding_failed',
        );
      }

      await this.devicesService.markOffline(deviceId);
    }, 120000);

    this.feedingTimeouts.set(deviceId, timeout);
  }

  sendCapturePhotosCommand(deviceId: string, petId: number, durationSeconds: number = 8) {
    this.logger.log(`Sending capture_photos command to ${deviceId} for pet ${petId}`);
    this.publish(`feeder/${deviceId}/commands/capture_photos`, {
      petId,
      durationSeconds,
    });
  }

  sendDetectionCommand(deviceId: string, enabled: boolean) {
    this.logger.log(`Setting detection on ${deviceId} to ${enabled}`);
    if (enabled) {
      this.recognitionWarmupCounts.set(deviceId, 0);
    }
    this.client.publish(
      `feeder/${deviceId}/commands/detection`,
      JSON.stringify({ enabled }),
      { qos: 1, retain: true },
    );
  }

  // ── Utilities ─────────────────────────────────────────────

  private publish(topic: string, payload: object, qos: 0 | 1 = 1) {
    this.client.publish(
      topic,
      JSON.stringify(payload),
      { qos },
      (err) => {
        if (err) this.logger.error(`Publish error on ${topic}: ${err.message}`);
      },
    );
  }

  private clearFeedingTimeout(deviceId: string) {
    const existing = this.feedingTimeouts.get(deviceId);
    if (existing) {
      clearTimeout(existing);
      this.feedingTimeouts.delete(deviceId);
    }
  }

  private async getPetName(petId: number): Promise<string> {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      select: { name: true },
    });
    return pet?.name ?? 'Your pet';
  }

  private async getPetWithSchedule(petId: number) {
    const anySchedule = await this.prisma.feedingSchedule.findFirst({
      where: { petId, isActive: true },
    });
    if (anySchedule) return null;

    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      select: { freePortionSize: true },
    });
    return pet ? { defaultPortionSize: pet.freePortionSize } : null;
  }
}