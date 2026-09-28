/**
 * AUTO-GENERATED FILE.
 *
 * Source table: diets
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
import { DietMeals } from "./diet-meals.entity.js";

@Entity("diets")
export class Diets {
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
    nullable: true,
    unsigned: true,
    precision: 10,
    scale: 0,
  })
  patientId!: number;

  @Column({
    type: "int",
    name: "template_id",
    nullable: true,
    unsigned: true,
    precision: 10,
    scale: 0,
  })
  templateId!: number;

  @Column({
    type: "varchar",
    name: "name",
    nullable: false,
    length: 150,
  })
  name!: string;

  @Column({
    type: "date",
    name: "start_date",
    nullable: false,
  })
  startDate!: Date;

  @Column({
    type: "date",
    name: "end_date",
    nullable: true,
  })
  endDate!: Date;

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
    type: "varchar",
    name: "objective",
    nullable: true,
    length: 500,
  })
  objective!: string;

  @Column({
    type: "text",
    name: "notes",
    nullable: true,
    length: 65535,
  })
  notes!: string;

  @Column({
    type: "enum",
    name: "status",
    nullable: false,
    length: 9,
    enum: ["active", "completed"],
    default: "active",
  })
  status!: "active" | "completed";

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
    (patients) => patients.diets,
  )
  @JoinColumn({
    name: "patient_id",
    referencedColumnName: "id",
  })
  patient!: Patients;

  @ManyToOne(
    () => Diets,
    (diets) => diets.derivedDiets,
  )
  @JoinColumn({
    name: "template_id",
    referencedColumnName: "id",
  })
  template!: Diets;

  @OneToMany(
    () => Diets,
    (diets) => diets.template,
  )
  derivedDiets!: Diets[];

  @OneToMany(
    () => DietMeals,
    (dietMeals) => dietMeals.diet,
  )
  dietMeals!: DietMeals[];
}
