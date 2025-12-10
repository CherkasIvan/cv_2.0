import { ApiProperty } from '@nestjs/swagger';
import { TranslationMetadataModel } from '../../models/i18n/translation-metadata.model';

export class TranslationMetadataResponseClassDto implements TranslationMetadataModel {
  @ApiProperty()
  translations: Record<string, any>;

  @ApiProperty()
  lastModified: Date;

  @ApiProperty()
  language: string;
}