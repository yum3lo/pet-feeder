import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Subject } from 'rxjs';
import { MessageEvent } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private subjects = new Map<number, Subject<MessageEvent>>();

  constructor(private prisma: PrismaService) {}

  getSubjectForUser(userId: number): Subject<MessageEvent> {
    if (!this.subjects.has(userId)) {
      this.subjects.set(userId, new Subject<MessageEvent>());
    }
    return this.subjects.get(userId)!;
  }

  emit(userId: number, type: string, data: Record<string, unknown>) {
    const subject = this.subjects.get(userId);
    if (subject) {
      subject.next({ data: { type, ...data } });
    }
  }

  async create(userId: number, message: string, type: string) {
    const notification = await this.prisma.notification.create({
      data: { userId, message, type },
    });

    const subject = this.subjects.get(userId);
    if (subject) {
      subject.next({ data: notification });
    }

    return notification;
  }

  async findAllByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: number, userId: number) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  removeSubjectForUser(userId: number) {
    const subject = this.subjects.get(userId);
    if (subject) {
      subject.complete();
      this.subjects.delete(userId);
    }
  }
}