import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ManualFeedDto } from './dto/manual-feed.dto';

@Injectable()
export class FeedingService {
  // MqttService injected via setter to avoid circular dependency
  private mqttService: any;

  constructor(private prisma: PrismaService) {}

  setMqttService(mqttService: any) {
    this.mqttService = mqttService;
  }

  // ── Schedules ─────────────────────────────────────────────

  async createSchedule(userId: number, dto: CreateScheduleDto) {
    const pet = await this.prisma.pet.findUnique({
      where: { id: dto.petId },
    });
    if (!pet) throw new NotFoundException('Pet not found.');
    if (pet.userId !== userId) throw new ForbiddenException('Access denied.');

    const device = await this.prisma.device.findUnique({
      where: { deviceId: dto.deviceId },
    });
    if (!device) throw new NotFoundException('Device not found.');
    if (device.userId !== userId) throw new ForbiddenException('Access denied.');

    return this.prisma.feedingSchedule.create({
      data: {
        petId: dto.petId,
        deviceId: dto.deviceId,
        time: dto.time,
        portionSize: dto.portionSize,
        feedingMode: dto.feedingMode ?? 'scheduled',
        isActive: true,
      },
    });
  }

  async getSchedulesByPet(petId: number, userId: number) {
    const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) throw new NotFoundException('Pet not found.');
    if (pet.userId !== userId) throw new ForbiddenException('Access denied.');

    return this.prisma.feedingSchedule.findMany({
      where: { petId },
      orderBy: { time: 'asc' },
    });
  }

  async toggleSchedule(scheduleId: number, userId: number, isActive: boolean) {
    const schedule = await this.prisma.feedingSchedule.findUnique({
      where: { id: scheduleId },
      include: { pet: true },
    });
    if (!schedule) throw new NotFoundException('Schedule not found.');
    if (schedule.pet.userId !== userId) throw new ForbiddenException('Access denied.');

    return this.prisma.feedingSchedule.update({
      where: { id: scheduleId },
      data: { isActive },
    });
  }

  async updateSchedule(scheduleId: number, userId: number, time?: string, portionSize?: number) {
    const schedule = await this.prisma.feedingSchedule.findUnique({
      where: { id: scheduleId },
      include: { pet: true },
    });
    if (!schedule) throw new NotFoundException('Schedule not found.');
    if (schedule.pet.userId !== userId) throw new ForbiddenException('Access denied.');
    if (!time && portionSize === undefined) throw new BadRequestException('Provide at least one field to update.');

    return this.prisma.feedingSchedule.update({
      where: { id: scheduleId },
      data: {
        ...(time && { time }),
        ...(portionSize !== undefined && { portionSize }),
      },
    });
  }

  async deleteSchedule(scheduleId: number, userId: number) {
    const schedule = await this.prisma.feedingSchedule.findUnique({
      where: { id: scheduleId },
      include: { pet: true },
    });
    if (!schedule) throw new NotFoundException('Schedule not found.');
    if (schedule.pet.userId !== userId) throw new ForbiddenException('Access denied.');

    await this.prisma.feedingSchedule.delete({ where: { id: scheduleId } });
    return { message: 'Schedule deleted successfully.' };
  }

  // ── Cron job — runs every minute ──────────────────────────

  @Cron('* * * * *')
  async checkSchedules() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const dueSchedules = await this.prisma.feedingSchedule.findMany({
      where: {
        isActive: true,
        time: currentTime,
        feedingMode: 'scheduled',
      },
      include: { pet: true },
    });

    for (const schedule of dueSchedules) {
      console.log(`[CRON] Firing schedule ${schedule.id} for pet ${schedule.petId}`);
      await this.executeFeeding(
        schedule.deviceId,
        schedule.petId,
        schedule.portionSize,
        'scheduled',
      );
    }
  }

  // ── Manual feeding ────────────────────────────────────────

  async manualFeed(userId: number, dto: ManualFeedDto) {
    const pet = await this.prisma.pet.findUnique({ where: { id: dto.petId } });
    if (!pet) throw new NotFoundException('Pet not found.');
    if (pet.userId !== userId) throw new ForbiddenException('Access denied.');

    const device = await this.prisma.device.findUnique({
      where: { deviceId: dto.deviceId },
    });
    if (!device) throw new NotFoundException('Device not found.');
    if (device.userId !== userId) throw new ForbiddenException('Access denied.');
    if (!device.isOnline) throw new BadRequestException('Device is offline.');

    const portionSize = dto.portionSize ?? 50;

    await this.executeFeeding(
      dto.deviceId,
      dto.petId,
      portionSize,
      'manual',
    );

    return { message: 'Feed command sent successfully.' };
  }

  // ── Shared feeding execution ──────────────────────────────

  async executeFeeding(
    deviceId: string,
    petId: number,
    portionGrams: number,
    feedingType: string,
  ) {
    const log = await this.prisma.feedingLog.create({
      data: {
        petId,
        deviceId,
        scheduledGrams: portionGrams,
        dispensedGrams: 0,
        feedingType,
        status: 'pending',
      },
    });

    // sending dispense command to Pi via MQTT
    if (this.mqttService) {
      this.mqttService.sendDispenseCommand(deviceId, petId, portionGrams, log.id);
    }

    return log;
  }

  // ── Feeding result (called by MQTT service) ───────────────

  async handleFeedingResult(
    deviceId: string,
    scheduledPetId: number | null,
    actualPetId: number | null,
    dispensedGrams: number,
    consumedGrams: number,
    leftoverGrams: number,
  ) {
    // updating the most recent pending/failed log for this device
    // (the 60s timeout may have already marked it failed before the result arrived)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const pendingLog = await this.prisma.feedingLog.findFirst({
      where: {
        deviceId,
        status: { in: ['pending', 'failed'] },
        timestamp: { gte: fiveMinutesAgo },
      },
      orderBy: { timestamp: 'desc' },
    });

    if (pendingLog) {
      await this.prisma.feedingLog.update({
        where: { id: pendingLog.id },
        data: {
          petId: scheduledPetId,
          actualPetId: actualPetId,
          dispensedGrams,
          consumedGrams,
          leftoverGrams,
          status: 'completed',
        },
      });
    }

    // if a different pet ate the food, adjust its next portion
    if (actualPetId && actualPetId !== scheduledPetId && leftoverGrams > 0) {
      await this.adjustNextPortion(actualPetId, leftoverGrams);
    }

    // adjusting scheduled pet's next portion by leftover
    if (scheduledPetId && leftoverGrams > 0) {
      await this.adjustNextPortion(scheduledPetId, -leftoverGrams);
    }

    return pendingLog;
  }

  async markFeedingFailed(deviceId: string) {
    const pendingLog = await this.prisma.feedingLog.findFirst({
      where: { deviceId, status: 'pending' },
      orderBy: { timestamp: 'desc' },
    });
    if (pendingLog) {
      await this.prisma.feedingLog.update({
        where: { id: pendingLog.id },
        data: { status: 'failed' },
      });
    }
  }

  private async adjustNextPortion(petId: number, adjustmentGrams: number) {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // find the next schedule after the current time, fall back to earliest (next day)
    let nextSchedule = await this.prisma.feedingSchedule.findFirst({
      where: { petId, isActive: true, time: { gt: currentTime } },
      orderBy: { time: 'asc' },
    });

    if (!nextSchedule) {
      nextSchedule = await this.prisma.feedingSchedule.findFirst({
        where: { petId, isActive: true },
        orderBy: { time: 'asc' },
      });
    }

    if (!nextSchedule) return;

    const newPortion = Math.max(5, nextSchedule.portionSize - adjustmentGrams);
    await this.prisma.feedingSchedule.update({
      where: { id: nextSchedule.id },
      data: { portionSize: newPortion },
    });

    console.log(
      `[FEEDING] Adjusted next portion for pet ${petId}: ` +
      `${nextSchedule.portionSize}g -> ${newPortion}g`,
    );
  }

  // ── History ───────────────────────────────────────────────

  async getHistory(userId: number, petId?: number, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const userPets = await this.prisma.pet.findMany({
      where: { userId },
      select: { id: true },
    });
    const petIds = userPets.map((p) => p.id);

    return this.prisma.feedingLog.findMany({
      where: {
        petId: petId ? petId : { in: petIds },
        timestamp: { gte: since },
      },
      include: {
        pet: { select: { id: true, name: true, imageUrl: true } },
      },
      orderBy: { timestamp: 'desc' },
    });
  }
}