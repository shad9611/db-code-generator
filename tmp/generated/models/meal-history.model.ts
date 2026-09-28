/**
 * AUTO-GENERATED FILE.
 *
 * Source table: meal_history
 * DO NOT EDIT MANUALLY.
 */

export interface MealHistoryModel {
  id: number;
  patientId: number;
  name: string;
  mealTime: string;
  foods: string;
  calories: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
