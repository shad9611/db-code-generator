/**
 * AUTO-GENERATED FILE.
 *
 * Source table: progress_records
 * DO NOT EDIT MANUALLY.
 */

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Patients } from "./patients.entity.js";

@Entity("progress_records")
export class ProgressRecords {
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
    type: "date",
    name: "record_date",
    nullable: false,
  })
  recordDate!: Date;

  @Column({
    type: "decimal",
    name: "weight",
    nullable: false,
    precision: 5,
    scale: 2,
  })
  weight!: number;

  @Column({
    type: "int",
    name: "calories_consumed",
    nullable: true,
    unsigned: true,
    precision: 10,
    scale: 0,
  })
  caloriesConsumed!: number;

  @Column({
    type: "int",
    name: "calories_target",
    nullable: true,
    unsigned: true,
    precision: 10,
    scale: 0,
  })
  caloriesTarget!: number;

  @Column({
    type: "tinyint",
    name: "satisfaction_level",
    nullable: true,
    unsigned: true,
    precision: 3,
    scale: 0,
  })
  satisfactionLevel!: number;

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
    name: "deleted_at",
    nullable: true,
  })
  deletedAt!: Date;

  @ManyToOne(
    () => Patients,
    (patients) => patients.progressRecords,
  )
  @JoinColumn({
    name: "patient_id",
    referencedColumnName: "id",
  })
  patient!: Patients;




}
