/**
 * AUTO-GENERATED FILE.
 *
 * Source table: migrations
 * DO NOT EDIT MANUALLY.
 */

import {
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateMigrationsDto {
  @IsNumber()
  timestamp: number;

  @IsString()
  name: string;
}

export class UpdateMigrationsDto extends CreateMigrationsDto {}
