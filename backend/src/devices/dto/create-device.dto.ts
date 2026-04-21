import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty({ example: 'feeder_01' })
  @IsString()
  deviceId!: string;

  @ApiPropertyOptional({ example: 'Living Room Feeder' })
  @IsOptional()
  @IsString()
  name?: string;
}