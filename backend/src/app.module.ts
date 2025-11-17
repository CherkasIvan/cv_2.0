import { CacheModule } from '@nestjs/cache-manager';
import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FirebaseModule } from './modules/firebase/firebase.module';
import { MigrationModule } from './modules/migration/migration.module';
import { AuthSessionEntity } from './entities/auth-session.entity';
import { NavigationEntity } from './entities/navigation.entity';
import { SocialMediaEntity } from './entities/social-media.entity';
import { TechnologyEntity } from './entities/technology.entity';
import { MainPageInfoEntity } from './entities/main-page-info.entity';
import { ProjectEntity } from './entities/project.entity';
import { RepositoryMigrationEntity } from './entities/repository-migration.entity';
import { PersonEntity } from './entities/person.entity';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { EducationExperienceEntity } from './entities/education-experience.entity';
import { WorkExperienceEntity } from './entities/work-experience.entity';
import { HardSkillsNavEntity } from './entities/hard-skills-nav.entity';
import { TechnologiesAsideEntity } from './entities/technologies-aside.entity';
import { ExperienceAsideEntity } from './entities/experience-aside.entity';
import { ThemelessPicturesEntity } from './entities/themeless-pictures.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        // Временно закомментируйте FirebaseModule для диагностики
        // FirebaseModule,
        MigrationModule,
        CacheModule.register({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const logger = new Logger('TypeORM');
                
                const config = {
                    type: 'postgres' as const, // Явно указываем тип
                    host: configService.get('POSTGRES_HOST', 'postgres'),
                    port: configService.get('POSTGRES_PORT', 5432),
                    username: configService.get('POSTGRES_USER', 'jv13'),
                    password: configService.get('POSTGRES_PASSWORD', 'postgres'),
                    database: configService.get('POSTGRES_DB', 'cv_db'),
                    entities: [
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
                    ],
                    synchronize: true,
                    logging: true,
                    retryDelay: 3000,
                    retryAttempts: 10,
                };

                logger.log('Database configuration:');
                logger.log(`Host: ${config.host}`);
                logger.log(`Port: ${config.port}`);
                logger.log(`Database: ${config.database}`);
                logger.log(`Username: ${config.username}`);

                return config;
            },
            inject: [ConfigService],
        }),
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
        AuthModule,
    ],
})
export class AppModule implements OnModuleInit {
    private readonly logger = new Logger('AppModule');

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        this.logger.log('=== ENVIRONMENT VARIABLES CHECK ===');
        this.logger.log(`POSTGRES_HOST: ${this.configService.get('POSTGRES_HOST')}`);
        this.logger.log(`POSTGRES_PORT: ${this.configService.get('POSTGRES_PORT')}`);
        this.logger.log(`POSTGRES_USER: ${this.configService.get('POSTGRES_USER')}`);
        this.logger.log(`POSTGRES_DB: ${this.configService.get('POSTGRES_DB')}`);
        this.logger.log(`FIREBASE_PRIVATE_KEY exists: ${!!this.configService.get('FIREBASE_PRIVATE_KEY')}`);
        this.logger.log('=== END ENV CHECK ===');

        // Также проверьте process.env напрямую
        this.logger.log('=== PROCESS.ENV DIRECT CHECK ===');
        this.logger.log(`POSTGRES_HOST: ${process.env.POSTGRES_HOST}`);
        this.logger.log(`POSTGRES_USER: ${process.env.POSTGRES_USER}`);
        this.logger.log(`FIREBASE_PRIVATE_KEY: ${process.env.FIREBASE_PRIVATE_KEY ? 'SET' : 'NOT SET'}`);
        this.logger.log('=== END PROCESS.ENV CHECK ===');
    }
}