import { LanguageStatsModel } from '@shared/models/i18n/language-stats.model';

import { ApiProperty } from '@nestjs/swagger';

export class LanguageStatsResponseClassDto implements LanguageStatsModel {
    @ApiProperty()
    totalKeys: number;

    @ApiProperty()
    modules: number;

    @ApiProperty()
    lastModified: Date;
}
