import { ExperienceAsideEntity } from '@shared/entities/experience-aside.entity';
import { HardSkillsNavEntity } from '@shared/entities/hard-skills-nav.entity';
import { MainPageInfoEntity } from '@shared/entities/main-page-info.entity';
import { NavigationEntity } from '@shared/entities/navigation.entity';
import { SocialMediaEntity } from '@shared/entities/social-media.entity';
import { TechnologiesAsideEntity } from '@shared/entities/technologies-aside.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TemplateController } from './controller/template.controller';
import { TemplateService } from './service/template.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MainPageInfoEntity,
            NavigationEntity,
            SocialMediaEntity,
            ExperienceAsideEntity,
            TechnologiesAsideEntity,
            HardSkillsNavEntity,
        ]),
    ],
    controllers: [TemplateController],
    providers: [TemplateService],
    exports: [TemplateService],
})
export class TemplateModule {}
