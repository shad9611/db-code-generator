/**
 * AUTO-GENERATED FILE.
 *
 * Source table: migrations
 * DO NOT EDIT MANUALLY.
 */

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("migrations")
export class Migrations {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    nullable: false,
    precision: 10,
    scale: 0,
  })
  id!: number;

  @Column({
    type: "bigint",
    name: "timestamp",
    nullable: false,
    precision: 19,
    scale: 0,
  })
  timestamp!: number;

  @Column({
    type: "varchar",
    name: "name",
    nullable: false,
    length: 255,
  })
  name!: string;






}
