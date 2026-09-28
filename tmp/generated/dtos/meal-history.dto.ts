/**
 * AUTO-GENERATED FILE.
 *
 * Source table: meal_history
 * DO NOT EDIT MANUALLY.
 */

import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMealHistoryDto {
  @IsNumber()
  patientId: number;

  @IsString()
  name: string;

  @IsString()
  mealTime: string;

  @IsString()
  foods: string;

  @IsNumber()
  calories: number;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date | null;
}

export class UpdateMealHistoryDto extends CreateMealHistoryDto {}
