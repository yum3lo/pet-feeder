import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ManualFeedDto {
  @ApiProperty({ example: 'feeder_01' })
  @IsString()
  deviceId!: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  petId!: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(500)
  portionSize?: number;
}