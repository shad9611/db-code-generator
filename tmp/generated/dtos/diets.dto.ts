/**
 * AUTO-GENERATED FILE.
 *
 * Source table: diets
 * DO NOT EDIT MANUALLY.
 */

import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDietsDto {
  @IsOptional()
  @IsNumber()
  patientId?: number | null;

  @IsOptional()
  @IsNumber()
  templateId?: number | null;

  @IsString()
  name: string;

  @IsDate()
  startDate: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date | null;

  @IsNumber()
  calories: number;

  @IsOptional()
  @IsString()
  objective?: string | null;

  @IsOptional()
  @IsString()
  notes?: string | null;


  status: unknown;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date | null;
}

export class UpdateDietsDto extends CreateDietsDto {}
