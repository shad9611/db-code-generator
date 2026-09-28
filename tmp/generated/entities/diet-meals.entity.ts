/**
 * AUTO-GENERATED FILE.
 *
 * Source table: diet_meals
 * DO NOT EDIT MANUALLY.
 */

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Diets } from "./diets.entity.js";

@Entity("diet_meals")
export class DietMeals {
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
    name: "diet_id",
    nullable: false,
    unsigned: true,
    precision: 10,
    scale: 0,
  })
  dietId!: number;

  @Column({
    type: "varchar",
    name: "meal_time",
    nullable: false,
    length: 20,
  })
  mealTime!: string;

  @Column({
    type: "varchar",
    name: "name",
    nullable: false,
    length: 150,
  })
  name!: string;

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
    type: "smallint",
    name: "display_order",
    nullable: false,
    unsigned: true,
    precision: 5,
    scale: 0,
    default: "0",
  })
  displayOrder!: number;

  @ManyToOne(
    () => Diets,
    (diets) => diets.dietMeals,
  )
  @JoinColumn({
    name: "diet_id",
    referencedColumnName: "id",
  })
  diet!: Diets;




}
