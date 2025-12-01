import * as path from 'path';

import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Config
import { getDatabaseConfig } from './config/database.config';
// Modules
import { AuthModule } from './core/auth/auth.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { MigrationModule } from './modules/migration/migration.module';
import { PersonModule } from './modules/person/person.module';
import { TemplateModule } from './modules/template/template.module';
// Entities
import { EducationExperienceEntity } from './shared/entities/education-experience.entity';
import { ExperienceAsideEntity } from './shared/entities/experience-aside.entity';
import { HardSkillsNavEntity } from './shared/entities/hard-skills-nav.entity';
import { MainPageInfoEntity } from './shared/entities/main-page-info.entity';
import { NavigationEntity } from './shared/entities/navigation.entity';
import { PersonEntity } from './shared/entities/person.entity';
import { PersonSessionEntity } from './shared/entities/person-session.entity';
import { PersonStateEntity } from './shared/entities/person-state.entity';
import { ProjectEntity } from './shared/entities/project.entity';
import { RepositoryMigrationEntity } from './shared/entities/repository-migration.entity';
import { SocialMediaEntity } from './shared/entities/social-media.entity';
import { TechnologiesAsideEntity } from './shared/entities/technologies-aside.entity';
import { TechnologyEntity } from './shared/entities/technology.entity';
import { ThemelessPicturesEntity } from './shared/entities/themeless-pictures.entity';
import { WorkExperienceEntity } from '@shared/entities/work-experience.entity';

const rootPath = path.resolve(process.cwd(), '..');
const envFile =
    process.env.NODE_ENV === 'production'
        ? '.env'
        : '.env.development';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                path.resolve(rootPath, envFile),
                path.resolve(rootPath, '.env'),
            ],
        }),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: getDatabaseConfig,
            inject: [ConfigService],
        }),

        FirebaseModule,
        MigrationModule,
        PersonModule,
        TemplateModule,
        AuthModule,

        CacheModule.register({
            isGlobal: true,
        }),

        TypeOrmModule.forFeature([
            NavigationEntity,
            SocialMediaEntity,
            EducationExperienceEntity,
            WorkExperienceEntity,
            TechnologyEntity,
            TechnologiesAsideEntity,
            ExperienceAsideEntity,
            HardSkillsNavEntity,
            PersonEntity,
            PersonSessionEntity,
            PersonStateEntity,
            ThemelessPicturesEntity,
            MainPageInfoEntity,
            ProjectEntity,
            RepositoryMigrationEntity,
        ]),
    ],
})
export class AppModule implements OnModuleInit {
    private readonly logger = new Logger('AppModule');

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        const isDevelopment =
            this.configService.get('NODE_ENV') === 'development';
        const isDocker = this.configService.get('DOCKER_CONTAINER') === 'true';

        this.logger.log(`=== APPLICATION STARTED ===`);
        this.logger.log(`Environment: ${this.configService.get('NODE_ENV')}`);
        this.logger.log(`Docker Container: ${isDocker}`);
        this.logger.log(
            `Database Host: ${this.configService.get('POSTGRES_HOST')}`,
        );
        this.logger.log(
            `Database Name: ${this.configService.get('POSTGRES_DB')}`,
        );
        this.logger.log(
            `Auto Migration: ${this.configService.get('AUTO_MIGRATE')}`,
        );
        this.logger.log(`=========================================`);
    }
}
