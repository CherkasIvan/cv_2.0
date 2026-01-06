import { EducationExperienceEntity } from '@shared/entities/education-experience.entity';
import { WorkExperienceEntity } from '@shared/entities/work-experience.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExperienceAsideEntity } from '../../shared/entities/experience-aside.entity';
import { HardSkillsNavEntity } from '../../shared/entities/hard-skills-nav.entity';
import { MainPageInfoEntity } from '../../shared/entities/main-page-info.entity';
import { NavigationEntity } from '../../shared/entities/navigation.entity';
import { PersonEntity } from '../../shared/entities/person.entity';
import { ProjectEntity } from '../../shared/entities/project.entity';
import { RepositoryMigrationEntity } from '../../shared/entities/repository-migration.entity';
import { SocialMediaEntity } from '../../shared/entities/social-media.entity';
import { TechnologiesAsideEntity } from '../../shared/entities/technologies-aside.entity';
import { TechnologyEntity } from '../../shared/entities/technology.entity';
import { ThemelessPicturesEntity } from '../../shared/entities/themeless-pictures.entity';
import { FirebaseModule } from '../firebase/firebase.module';
import { MigrationController } from './controller/migration.controller';
import { MigrationService } from './service/migration.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            NavigationEntity,
            SocialMediaEntity,
            EducationExperienceEntity,
            WorkExperienceEntity,
            TechnologyEntity,
            TechnologiesAsideEntity,
            EducationExperienceEntity,
            ExperienceAsideEntity,
            HardSkillsNavEntity,
            PersonEntity,
            ThemelessPicturesEntity,
            WorkExperienceEntity,
            MainPageInfoEntity,
            ProjectEntity,
            RepositoryMigrationEntity,
            HardSkillsNavEntity,
        ]),
        FirebaseModule,
    ],
    providers: [MigrationService],
    controllers: [MigrationController],
})
export class MigrationModule {}
