/**
 * AUTO-GENERATED FILE.
 *
 * Source table: patients
 * DO NOT EDIT MANUALLY.
 */

export interface PatientsModel {
  id: number;
  legacyId: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: unknown;
  height: number | null;
  weight: number | null;
  objective: string | null;
  medicalHistory: string | null;
  allergies: string | null;
  status: unknown;
  activeDietPlan: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
