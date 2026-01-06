import { ApiProperty } from '@nestjs/swagger';

import { IFileMetadataModel } from '../../models/file-storage/file-metadata.model';

export class FileResponseClassDto implements IFileMetadataModel {
    @ApiProperty()
    id: string;

    @ApiProperty()
    filename: string;

    @ApiProperty()
    path: string;

    @ApiProperty()
    size: number;

    @ApiProperty()
    mimeType: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    hash: string;

    @ApiProperty()
    category: string;

    @ApiProperty({ required: false, type: [String] })
    tags?: string[];

    @ApiProperty({ required: false })
    thumbnail?: string;

    @ApiProperty({ required: false })
    width?: number;

    @ApiProperty({ required: false })
    height?: number;

    @ApiProperty({ required: false })
    duration?: number;
}
