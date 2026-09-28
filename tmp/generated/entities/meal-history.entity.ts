/**
 * AUTO-GENERATED FILE.
 *
 * Source table: meal_history
 * DO NOT EDIT MANUALLY.
 */

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Patients } from "./patients.entity.js";
import { MealHistoryChanges } from "./meal-history-changes.entity.js";

@Entity("meal_history")
export class MealHistory {
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
    type: "int",
    name: "patient_id",
    nullable: false,
    unsigned: true,
    precision: 10,
    scale: 0,
  })
  patientId!: number;

  @Column({
    type: "varchar",
    name: "name",
    nullable: false,
    length: 150,
  })
  name!: string;

  @Column({
    type: "varchar",
    name: "meal_time",
    nullable: false,
    length: 20,
  })
  mealTime!: string;

  @Column({
    type: "text",
    name: "foods",
    nullable: false,
    length: 65535,
  })
  foods!: string;

  @Column({
    type: "int",
    name: "calories",
    nullable: false,
    unsigned: true,
    precision: 10,
    scale: 0,
  })
  calories!: number;

  @Column({
    type: "text",
    name: "notes",
    nullable: true,
    length: 65535,
  })
  notes!: string;

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

  @ManyToOne(
    () => Patients,
    (patients) => patients.mealHistory,
  )
  @JoinColumn({
    name: "patient_id",
    referencedColumnName: "id",
  })
  patient!: Patients;



  @OneToMany(
    () => MealHistoryChanges,
    (mealHistoryChanges) => mealHistoryChanges.mealHistory,
  )
  mealHistoryChanges!: MealHistoryChanges[];
}
