/**
 * AUTO-GENERATED FILE.
 *
 * Source table: users
 * DO NOT EDIT MANUALLY.
 */

import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUsersDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  passwordHash: string;


  role: unknown;

  @IsOptional()
  @IsString()
  professionalLicense?: string | null;

  @IsOptional()
  professionalLicenseStatus?: unknown | null;

  @IsNumber()
  status: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date | null;
}

export class UpdateUsersDto extends CreateUsersDto {}
