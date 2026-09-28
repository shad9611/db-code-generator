/**
 * AUTO-GENERATED FILE.
 *
 * Source table: diets
 * DO NOT EDIT MANUALLY.
 */

export interface DietsModel {
  id: number;
  patientId: number | null;
  templateId: number | null;
  name: string;
  startDate: Date;
  endDate: Date | null;
  calories: number;
  objective: string | null;
  notes: string | null;
  status: unknown;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
