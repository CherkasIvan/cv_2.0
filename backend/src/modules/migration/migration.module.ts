import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FirebaseModule } from '../firebase/firebase.module';
import { HardSkillsNavEntity } from '../../entities/hard-skills-nav.entity';
import { MainPageInfoEntity } from '../../entities/main-page-info.entity';
import { NavigationEntity } from '../../entities/navigation.entity';
import { PersonEntity } from '../../entities/person.entity';
import { ProjectEntity } from '../../entities/project.entity';
import { RepositoryMigrationEntity } from '../../entities/repository-migration.entity';
import { SocialMediaEntity } from '../../entities/social-media.entity';
import { TechnologiesAsideEntity } from '../../entities/technologies-aside.entity';
import { TechnologyEntity } from '../../entities/technology.entity';
import { ThemelessPicturesEntity } from '../../entities/themeless-pictures.entity';
import { UserEntity } from '../../entities/user.entity';
import { AuthSessionEntity } from '../../entities/auth-session.entity';
import { ExperienceAsideEntity } from '../../entities/experience-aside.entity';
import { WorkExperienceEntity } from 'src/entities/work-experience.entity';
import { EducationExperienceEntity } from 'src/entities/education-experience.entity';
import { MigrationController } from './controller/migration.controller';
import { MigrationService } from './service/migration.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AuthSessionEntity,
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
            PersonEntity,
            UserEntity,
            HardSkillsNavEntity
        ]),
        FirebaseModule,
    ],
    providers: [MigrationService],
    controllers: [MigrationController],
})
export class MigrationModule {}