/**
 * AUTO-GENERATED FILE.
 *
 * Source table: patients
 * DO NOT EDIT MANUALLY.
 */

import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePatientsDto {
  @IsString()
  legacyId: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsNumber()
  age: number;


  gender: unknown;

  @IsOptional()
  @IsNumber()
  height?: number | null;

  @IsOptional()
  @IsNumber()
  weight?: number | null;

  @IsOptional()
  @IsString()
  objective?: string | null;

  @IsOptional()
  @IsString()
  medicalHistory?: string | null;

  @IsOptional()
  @IsString()
  allergies?: string | null;


  status: unknown;

  @IsNumber()
  activeDietPlan: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date | null;
}

export class UpdatePatientsDto extends CreatePatientsDto {}
