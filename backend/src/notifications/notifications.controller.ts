import { Controller, Get, Patch, Param, ParseIntPipe, UseGuards, Req, Sse, MessageEvent, OnModuleDestroy, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Sse('stream')
  @ApiOperation({ summary: 'Subscribe to real-time notifications via SSE' })
  stream(@Req() req): Observable<MessageEvent> {
    const userId = req.user.id;
    return this.notificationsService
      .getSubjectForUser(userId)
      .asObservable()
      .pipe(
        finalize(() => {
          this.notificationsService.removeSubjectForUser(userId);
        }),
      );
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications for current user' })
  findAll(@Req() req) {
    return this.notificationsService.findAllByUser(req.user.id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@Req() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markAsRead(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }
}