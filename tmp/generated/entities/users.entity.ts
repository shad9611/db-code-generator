/**
 * AUTO-GENERATED FILE.
 *
 * Source table: users
 * DO NOT EDIT MANUALLY.
 */

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class Users {
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
    name: "password_hash",
    nullable: false,
    length: 255,
  })
  passwordHash!: string;

  @Column({
    type: "enum",
    name: "role",
    nullable: false,
    length: 12,
    enum: ["nutritionist", "client", "admin"],
  })
  role!: "nutritionist" | "client" | "admin";

  @Column({
    type: "varchar",
    name: "professional_license",
    nullable: true,
    length: 50,
  })
  professionalLicense!: string;

  @Column({
    type: "enum",
    name: "professional_license_status",
    nullable: true,
    length: 8,
    enum: ["pending", "verified", "rejected"],
  })
  professionalLicenseStatus!: "pending" | "verified" | "rejected";

  @Column({
    type: "tinyint",
    name: "status",
    nullable: false,
    precision: 3,
    scale: 0,
    default: "1",
  })
  status!: number;

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
}
