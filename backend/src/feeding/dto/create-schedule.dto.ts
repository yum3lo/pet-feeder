import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  petId!: number;

  @ApiProperty({ example: 'feeder_01' })
  @IsString()
  deviceId!: string;

  @ApiProperty({ example: '08:00', description: 'Time in HH:MM format' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'time must be in HH:MM format',
  })
  time!: string;

  @ApiProperty({ example: 50, description: 'Portion size in grams' })
  @IsNumber()
  @Min(5)
  @Max(500)
  portionSize!: number;

  @ApiPropertyOptional({ example: 'scheduled', enum: ['scheduled', 'free'] })
  @IsOptional()
  @IsString()
  feedingMode?: string;
}