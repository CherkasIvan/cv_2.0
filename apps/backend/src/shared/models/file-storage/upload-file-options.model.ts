export interface IUploadFileOptionsModel {
    category?: string;
    tags?: string[];
    generateThumbnail?: boolean;
    resize?: {
        width?: number;
        height?: number;
    };
}
