/**
 * AUTO-GENERATED FILE.
 *
 * Source table: patients
 * DO NOT EDIT MANUALLY.
 */

import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Diets } from "./diets.entity.js";
import { MealHistory } from "./meal-history.entity.js";
import { ProgressRecords } from "./progress-records.entity.js";

@Entity("patients")
export class Patients {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    nullable: false,
    unsigned: true,
    precision: 10,
    scale: 0,
  })
  id!: number;

  @Column({
    type: "char",
    name: "legacy_id",
    nullable: false,
    length: 36,
  })
  legacyId!: string;

  @Column({
    type: "varchar",
    name: "name",
    nullable: false,
    length: 150,
  })
  name!: string;

  @Column({
    type: "varchar",
    name: "email",
    nullable: false,
    length: 254,
  })
  email!: string;

  @Column({
    type: "varchar",
    name: "phone",
    nullable: false,
    length: 30,
  })
  phone!: string;

  @Column({
    type: "tinyint",
    name: "age",
    nullable: false,
    unsigned: true,
    precision: 3,
    scale: 0,
  })
  age!: number;

  @Column({
    type: "enum",
    name: "gender",
    nullable: false,
    length: 6,
    enum: ["female", "male", "other"],
  })
  gender!: "female" | "male" | "other";

  @Column({
    type: "decimal",
    name: "height",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  height!: number;

  @Column({
    type: "decimal",
    name: "weight",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  weight!: number;

  @Column({
    type: "varchar",
    name: "objective",
    nullable: true,
    length: 500,
  })
  objective!: string;

  @Column({
    type: "text",
    name: "medical_history",
    nullable: true,
    length: 65535,
  })
  medicalHistory!: string;

  @Column({
    type: "text",
    name: "allergies",
    nullable: true,
    length: 65535,
  })
  allergies!: string;

  @Column({
    type: "enum",
    name: "status",
    nullable: false,
    length: 8,
    enum: ["active", "inactive"],
    default: "active",
  })
  status!: "active" | "inactive";

  @Column({
    type: "tinyint",
    name: "active_diet_plan",
    nullable: false,
    precision: 3,
    scale: 0,
    default: "0",
  })
  activeDietPlan!: number;

  @Column({
    type: "datetime",
    name: "created_at",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt!: Date;

  @Column({
    type: "datetime",
    name: "updated_at",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  updatedAt!: Date;

  @Column({
    type: "datetime",
    name: "deleted_at",
    nullable: true,
  })
  deletedAt!: Date;





  @OneToMany(
    () => Diets,
    (diets) => diets.patient,
  )
  diets!: Diets[];

  @OneToMany(
    () => MealHistory,
    (mealHistory) => mealHistory.patient,
  )
  mealHistory!: MealHistory[];

  @OneToMany(
    () => ProgressRecords,
    (progressRecords) => progressRecords.patient,
  )
  progressRecords!: ProgressRecords[];
}
