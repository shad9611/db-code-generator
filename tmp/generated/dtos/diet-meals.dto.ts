/**
 * AUTO-GENERATED FILE.
 *
 * Source table: diet_meals
 * DO NOT EDIT MANUALLY.
 */

import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDietMealsDto {
  @IsNumber()
  dietId: number;

  @IsString()
  mealTime: string;

  @IsString()
  name: string;

  @IsString()
  foods: string;

  @IsNumber()
  calories: number;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsNumber()
  displayOrder: number;
}

export class UpdateDietMealsDto extends CreateDietMealsDto {}
