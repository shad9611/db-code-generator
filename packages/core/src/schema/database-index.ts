export interface DatabaseIndex {
  name: string;

  columns: string[];

  unique: boolean;

  primary: boolean;
}
