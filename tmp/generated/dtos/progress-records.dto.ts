/**
 * AUTO-GENERATED FILE.
 *
 * Source table: progress_records
 * DO NOT EDIT MANUALLY.
 */

import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProgressRecordsDto {
  @IsNumber()
  patientId: number;

  @IsDate()
  recordDate: Date;

  @IsNumber()
  weight: number;

  @IsOptional()
  @IsNumber()
  caloriesConsumed?: number | null;

  @IsOptional()
  @IsNumber()
  caloriesTarget?: number | null;

  @IsOptional()
  @IsNumber()
  satisfactionLevel?: number | null;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date | null;
}

export class UpdateProgressRecordsDto extends CreateProgressRecordsDto {}
