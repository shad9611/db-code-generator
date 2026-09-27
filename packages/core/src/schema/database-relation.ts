export type DatabaseRelationType =
  | "one-to-one"
  | "one-to-many"
  | "many-to-one"
  | "many-to-many";

export interface DatabaseRelation {
  type: DatabaseRelationType;

  sourceTable: string;

  sourceColumn: string;

  targetTable: string;

  targetColumn: string;

  onDelete?: string;

  onUpdate?: string;

  /**
   * Name of the database constraint.
   */
  constraintName?: string;
}
