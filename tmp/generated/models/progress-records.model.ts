/**
 * AUTO-GENERATED FILE.
 *
 * Source table: progress_records
 * DO NOT EDIT MANUALLY.
 */

export interface ProgressRecordsModel {
  id: number;
  patientId: number;
  recordDate: Date;
  weight: number;
  caloriesConsumed: number | null;
  caloriesTarget: number | null;
  satisfactionLevel: number | null;
  notes: string | null;
  createdAt: Date;
  deletedAt: Date | null;
}
