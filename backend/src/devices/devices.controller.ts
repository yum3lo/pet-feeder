import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@ApiTags('Devices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a feeder device to your account' })
  register(@Req() req, @Body() dto: CreateDeviceDto) {
    return this.devicesService.register(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all devices registered to your account' })
  findAll(@Req() req) {
    return this.devicesService.findAllByUser(req.user.id);
  }

  @Get(':deviceId')
  @ApiOperation({ summary: 'Get a specific device by deviceId' })
  findOne(@Req() req, @Param('deviceId') deviceId: string) {
    return this.devicesService.findOne(deviceId, req.user.id);
  }

  @Delete(':deviceId')
  @ApiOperation({ summary: 'Remove a device from your account' })
  remove(@Req() req, @Param('deviceId') deviceId: string) {
    return this.devicesService.remove(deviceId, req.user.id);
  }
}