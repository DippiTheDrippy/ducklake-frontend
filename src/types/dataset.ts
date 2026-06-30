export interface Dataset {
  id: string;
  name: string;
  displayName: string;
  description: string;
  bucketName: string;
}

export interface ColumnSummary {
  columnName: string;
  columnType: string;
  min: string;
  max: string;
  approxUnique: number;
  avg: string;
  std: string;
  q25: string;
  q50: string;
  q75: string;
  rowCount: number;
  null_percentage: number;
}

export interface DatasetWithSummary {
  dataset: Dataset;
  summary: ColumnSummary[];
}
