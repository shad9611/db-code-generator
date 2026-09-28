/**
 * AUTO-GENERATED FILE.
 *
 * Source table: meal_history_changes
 * DO NOT EDIT MANUALLY.
 */

import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMealHistoryChangesDto {
  @IsNumber()
  mealHistoryId: number;

  @IsString()
  reason: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  modifiedBy?: string | null;

  @IsDate()
  createdAt: Date;
}

export class UpdateMealHistoryChangesDto extends CreateMealHistoryChangesDto {}
