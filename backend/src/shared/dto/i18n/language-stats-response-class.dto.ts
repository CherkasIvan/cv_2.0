import { ApiProperty } from '@nestjs/swagger';
import { LanguageStatsModel } from '@shared/models/i18n/language-stats.model';

export class LanguageStatsResponseClassDto implements LanguageStatsModel {
  @ApiProperty()
  totalKeys: number;

  @ApiProperty()
  modules: number;

  @ApiProperty()
  lastModified: Date;
}