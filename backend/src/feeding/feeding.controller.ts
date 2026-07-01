import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FeedingService } from './feeding.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ManualFeedDto } from './dto/manual-feed.dto';
import { ToggleScheduleDto } from './dto/toggle-schedule.dto';
import { CapturePhotosDto } from './dto/capture-photos.dto';
import { UpdatePortionDto } from './dto/update-portion.dto';
import { MqttService } from '../mqtt/mqtt.service';
import { RecognitionService } from '../recognition/recognition.service';

@ApiTags('Feeding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('feeding')
export class FeedingController {
  constructor(
    private feedingService: FeedingService,
    private mqttService: MqttService,
    private recognitionService: RecognitionService
  ) {}

  // ── Schedules ─────────────────────────────────────────────

  @Post('schedules')
  @ApiOperation({ summary: 'Create a feeding schedule for a pet' })
  createSchedule(@Req() req, @Body() dto: CreateScheduleDto) {
    return this.feedingService.createSchedule(req.user.id, dto);
  }

  @Get('schedules/pet/:petId')
  @ApiOperation({ summary: 'Get all schedules for a pet' })
  getSchedules(
    @Req() req,
    @Param('petId', ParseIntPipe) petId: number,
  ) {
    return this.feedingService.getSchedulesByPet(petId, req.user.id);
  }

  @Patch('schedules/:id/toggle')
  @ApiOperation({ summary: 'Activate or deactivate a schedule' })
  toggleSchedule(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ToggleScheduleDto,
  ) {
    return this.feedingService.toggleSchedule(id, req.user.id, dto.isActive);
  }

  @Patch('schedules/:id')
  @ApiOperation({ summary: 'Update the time and/or portion size of a schedule' })
  updateSchedule(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePortionDto,
  ) {
    return this.feedingService.updateSchedule(id, req.user.id, dto.time, dto.portionSize);
  }

  @Delete('schedules/:id')
  @ApiOperation({ summary: 'Delete a feeding schedule' })
  deleteSchedule(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.feedingService.deleteSchedule(id, req.user.id);
  }

  // ── Manual feeding ────────────────────────────────────────

  @Post('manual')
  @ApiOperation({ summary: 'Trigger an immediate manual feeding' })
  manualFeed(@Req() req, @Body() dto: ManualFeedDto) {
    return this.feedingService.manualFeed(req.user.id, dto);
  }

  // ── History ───────────────────────────────────────────────

  @Get('history')
  @ApiOperation({ summary: 'Get feeding history' })
  @ApiQuery({ name: 'petId', required: false, type: Number })
  @ApiQuery({ name: 'days', required: false, type: Number })
  getHistory(
    @Req() req,
    @Query('petId') petId?: number,
    @Query('days') days?: number,
  ) {
    return this.feedingService.getHistory(
      req.user.id,
      petId ? Number(petId) : undefined,
      days ? Number(days) : 30,
    );
  }

  // ── Capture Photos ───────────────────────────────
  @Post('capture-photos')
  @ApiOperation({ summary: 'Trigger training photo capture on the device' })
  capturePhotos(
    @Req() req,
    @Body() dto: CapturePhotosDto,
  ) {
    setTimeout(() => this.mqttService.sendCapturePhotosCommand(dto.deviceId, dto.petId), 5000);
    return { message: 'Photo capture command sent.' };
  }

  // ── Capture Background ───────────────────────────────
  @Post('capture-background')
  @ApiOperation({ summary: 'Capture background photos (empty bowl, no pet)' })
  captureBackground(
    @Req() req,
    @Body() dto: CapturePhotosDto,
  ) {
    setTimeout(() => this.mqttService.sendCapturePhotosCommand(dto.deviceId, 0, 2), 5000);
    return { message: 'Background capture command sent.' };
  }

  // ── Train Model ────────────────────────────────────────
  @Post('train/:deviceId')
  @ApiOperation({ summary: 'Trigger model training for all pets of this user' })
  async trainModel(@Req() req, @Param('deviceId') deviceId: string) {
    const result = await this.recognitionService.trainModel(req.user.id);
    if (result.success) {
      this.mqttService.sendDetectionCommand(deviceId, true);
    }
    return result;
  }
}