/**
 * AUTO-GENERATED FILE.
 *
 * Source table: meal_history_changes
 * DO NOT EDIT MANUALLY.
 */

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MealHistory } from "./meal-history.entity.js";

@Entity("meal_history_changes")
export class MealHistoryChanges {
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
    name: "meal_history_id",
    nullable: false,
    unsigned: true,
    precision: 10,
    scale: 0,
  })
  mealHistoryId!: number;

  @Column({
    type: "varchar",
    name: "reason",
    nullable: false,
    length: 500,
  })
  reason!: string;

  @Column({
    type: "text",
    name: "description",
    nullable: false,
    length: 65535,
  })
  description!: string;

  @Column({
    type: "varchar",
    name: "modified_by",
    nullable: true,
    length: 150,
  })
  modifiedBy!: string;

  @Column({
    type: "datetime",
    name: "created_at",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt!: Date;

  @ManyToOne(
    () => MealHistory,
    (mealHistory) => mealHistory.mealHistoryChanges,
  )
  @JoinColumn({
    name: "meal_history_id",
    referencedColumnName: "id",
  })
  mealHistory!: MealHistory;




}
