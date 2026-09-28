/**
 * AUTO-GENERATED FILE.
 *
 * Source table: users
 * DO NOT EDIT MANUALLY.
 */

export interface UsersModel {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: unknown;
  professionalLicense: string | null;
  professionalLicenseStatus: unknown | null;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
