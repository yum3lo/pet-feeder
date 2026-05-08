import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePortionDto {
  @ApiProperty({ example: 50, description: 'New portion size in grams' })
  @IsNumber()
  @Min(5)
  @Max(500)
  portionSize!: number;
}
