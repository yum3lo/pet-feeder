import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CapturePhotosDto {
  @ApiProperty({ example: 'feeder_01' })
  @IsString()
  deviceId!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  petId!: number;
}
