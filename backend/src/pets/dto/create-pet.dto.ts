import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePetDto {
  @ApiProperty({ example: 'Whiskers' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'cat' })
  @IsOptional()
  @IsString()
  species?: string;

  @ApiPropertyOptional({ example: 'Persian' })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiPropertyOptional({ example: 4.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: ['No dairy', 'Low sodium'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietaryRestrictions?: string[];

  @ApiPropertyOptional({ example: 20, description: 'Grams dispensed per free-feeding visit (default 20g)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  freePortionSize?: number;
}