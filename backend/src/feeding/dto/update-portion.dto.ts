import { IsNumber, IsOptional, IsString, Min, Max, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePortionDto {
  @ApiPropertyOptional({ example: '08:00', description: 'New time in HH:MM format' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'time must be in HH:MM format' })
  time?: string;

  @ApiPropertyOptional({ example: 50, description: 'New portion size in grams' })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(500)
  portionSize?: number;
}
