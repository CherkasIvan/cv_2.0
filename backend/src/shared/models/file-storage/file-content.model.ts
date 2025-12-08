import { IFileMetadataModel } from "./file-metadata.model";

export interface IFileContent {
  content: string | object;
  metadata: IFileMetadataModel;
}