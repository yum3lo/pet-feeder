import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async register(userId: number, dto: CreateDeviceDto) {
    const existing = await this.prisma.device.findUnique({
      where: { deviceId: dto.deviceId },
    });
    if (existing) {
      if (existing.userId !== userId) {
        throw new ConflictException('Device already registered to another account.');
      }
      return existing;
    }

    return this.prisma.device.create({
      data: {
        deviceId: dto.deviceId,
        name: dto.name,
        userId,
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.device.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(deviceId: string, userId: number) {
    const device = await this.prisma.device.findUnique({
      where: { deviceId },
    });
    if (!device) throw new NotFoundException('Device not found.');
    if (device.userId !== userId) throw new ForbiddenException('Access denied.');
    return device;
  }

  async remove(deviceId: string, userId: number) {
    await this.findOne(deviceId, userId);
    await this.prisma.device.delete({ where: { deviceId } });
    return { message: 'Device removed successfully.' };
  }

  // called by MQTT service when heartbeat arrives
  async markOnline(deviceId: string) {
    await this.prisma.device.updateMany({
      where: { deviceId },
      data: {
        isOnline: true,
        lastSeen: new Date(),
      },
    });
  }

  // called by MQTT service when device disconnects or heartbeat times out
  async markOffline(deviceId: string) {
    await this.prisma.device.updateMany({
      where: { deviceId },
      data: { isOnline: false },
    });
  }

  async updateContainerWeight(deviceId: string, weightGrams: number) {
    await this.prisma.device.updateMany({
      where: { deviceId },
      data: { containerWeight: weightGrams },
    });
  }

  async getUserIdByDeviceId(deviceId: string): Promise<number | null> {
    const device = await this.prisma.device.findUnique({
      where: { deviceId },
    });
    return device?.userId ?? null;
  }
}