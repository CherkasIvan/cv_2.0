export interface IFileMetadataModel {
  id: string;
  filename: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
  hash: string;
  category: string;
  tags?: string[];
  thumbnail?: string;
  width?: number;
  height?: number;
  duration?: number;
}