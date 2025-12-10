export interface IStorageStatsModel {
  totalFiles: number;
  totalSize: number;
  byCategory: Record<string, {
    count: number;
    size: number;
  }>;
}