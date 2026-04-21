import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleScheduleDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  isActive!: boolean;
}
