import { ApiProperty } from '@nestjs/swagger';

export class UploadFileClassDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  tags?: string;
}