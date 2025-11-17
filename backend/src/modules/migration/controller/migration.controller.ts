// src/modules/migration/controller/migration.controller.ts
import { Controller, Post, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { PersonEntity } from '../../../entities/person.entity';
import { ProjectEntity } from '../../../entities/project.entity';
import { RepositoryMigrationEntity } from '../../../entities/repository-migration.entity';
import { UserEntity } from '../../../entities/user.entity';
import { NavigationEntity } from '../../../entities/navigation.entity';
import { SocialMediaEntity } from '../../../entities/social-media.entity';
import { TechnologyEntity } from '../../../entities/technology.entity';
import { WorkExperienceEntity } from '../../../entities/work-experience.entity';
import { EducationExperienceEntity } from '../../../entities/education-experience.entity';
import { MainPageInfoEntity } from '../../../entities/main-page-info.entity';
import { HardSkillsNavEntity } from '../../../entities/hard-skills-nav.entity';
import { TechnologiesAsideEntity } from '../../../entities/technologies-aside.entity';
import { ExperienceAsideEntity } from '../../../entities/experience-aside.entity';
import { ThemelessPicturesEntity } from '../../../entities/themeless-pictures.entity';

import { MigrationService } from '../service/migration.service';

@ApiTags('migration')
@Controller('migration')
export class MigrationController {
    constructor(private readonly migrationService: MigrationService) {}

    @Post('all')
    @ApiOperation({ 
        summary: 'Полная миграция данных', 
        description: 'Перенос всех данных из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Все данные успешно мигрированы',
        schema: {
            example: { message: 'All migrations completed successfully' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при выполнении миграции' 
    })
    async migrateAllData(): Promise<{ message: string }> {
        return this.migrationService.migrateAllData();
    }

    @Post('navigation')
    @ApiOperation({ 
        summary: 'Миграция навигации', 
        description: 'Перенос данных навигации из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Навигация успешно мигрирована',
        schema: {
            example: { message: 'Navigation migration completed' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции навигации' 
    })
    async migrateNavigation(): Promise<{ message: string }> {
        await this.migrationService.migrateNavigation();
        return { message: 'Navigation migration completed' };
    }

    @Post('hard-skills-nav')
    @ApiOperation({ 
        summary: 'Миграция hard skills навигации', 
        description: 'Перенос данных hard skills навигации из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Hard skills навигация успешно мигрирована',
        schema: {
            example: { message: 'Hard skills navigation migration completed' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции hard skills навигации' 
    })
    async migrateHardSkillsNav(): Promise<{ message: string }> {
        await this.migrationService.migrateHardSkillsNav();
        return { message: 'Hard skills navigation migration completed' };
    }

    @Post('social-media')
    @ApiOperation({ 
        summary: 'Миграция социальных сетей', 
        description: 'Перенос данных социальных сетей из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Социальные сети успешно мигрированы',
        schema: {
            example: { message: 'Social media migration completed' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции социальных сетей' 
    })
    async migrateSocialMedia(): Promise<{ message: string }> {
        await this.migrationService.migrateSocialMedia();
        return { message: 'Social media migration completed' };
    }

    @Post('experience')
    @ApiOperation({ 
        summary: 'Миграция опыта работы и образования', 
        description: 'Перенос данных рабочего и образовательного опыта из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Опыт работы и образования успешно мигрирован',
        schema: {
            example: { message: 'Experience migration completed' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции опыта работы и образования' 
    })
    async migrateExperience(): Promise<{ message: string }> {
        await this.migrationService.migrateExperience();
        return { message: 'Experience migration completed' };
    }

    @Post('technologies-aside')
    @ApiOperation({ 
        summary: 'Миграция боковой панели технологий', 
        description: 'Перенос данных боковой панели технологий из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Боковая панель технологий успешно мигрирована',
        schema: {
            example: { message: 'Technologies aside migration completed' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции боковой панели технологий' 
    })
    async migrateTechnologiesAside(): Promise<{ message: string }> {
        await this.migrationService.migrateTechnologiesAside();
        return { message: 'Technologies aside migration completed' };
    }

    @Post('experience-aside')
    @ApiOperation({ 
        summary: 'Миграция боковой панели опыта', 
        description: 'Перенос данных боковой панели опыта из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Боковая панель опыта успешно мигрирована',
        schema: {
            example: { message: 'Experience aside migration completed' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции боковой панели опыта' 
    })
    async migrateExperienceAside(): Promise<{ message: string }> {
        await this.migrationService.migrateExperienceAside();
        return { message: 'Experience aside migration completed' };
    }

    @Post('technologies')
    @ApiOperation({ 
        summary: 'Миграция технологий', 
        description: 'Перенос данных технологий из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Технологии успешно мигрированы',
        schema: {
            example: { message: 'Technologies migration completed' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции технологий' 
    })
    async migrateTechnologies(): Promise<{ message: string }> {
        await this.migrationService.migrateTechnologies();
        return { message: 'Technologies migration completed' };
    }

    @Post('main-page-info')
    @ApiOperation({ 
        summary: 'Миграция информации главной страницы', 
        description: 'Перенос данных главной страницы из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Информация главной страницы успешно мигрирована',
        schema: {
            example: { message: 'Main page info migration completed' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции информации главной страницы' 
    })
    async migrateMainPageInfo(): Promise<{ message: string }> {
        await this.migrationService.migrateMainPageInfo();
        return { message: 'Main page info migration completed' };
    }

    @Post('themeless-pictures')
    @ApiOperation({ 
        summary: 'Миграция тематических изображений', 
        description: 'Перенос данных тематических изображений из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Тематические изображения успешно мигрированы',
        schema: {
            example: { message: 'Themeless pictures migration completed' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции тематических изображений' 
    })
    async migrateThemelessPictures(): Promise<{ message: string }> {
        await this.migrationService.migrateThemelessPictures();
        return { message: 'Themeless pictures migration completed' };
    }

    @Post('projects')
    @ApiOperation({ 
        summary: 'Миграция проектов', 
        description: 'Перенос данных проектов из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Проекты успешно мигрированы',
        schema: {
            example: { message: 'Projects migration completed' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции проектов' 
    })
    async migrateProjects(): Promise<{ message: string }> {
        await this.migrationService.migrateProjects();
        return { message: 'Projects migration completed' };
    }

    @Post('repositories')
    @ApiOperation({ 
        summary: 'Миграция репозиториев', 
        description: 'Перенос данных репозиториев из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Репозитории успешно мигрированы',
        schema: {
            example: { message: 'Repositories migration completed' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции репозиториев' 
    })
    async migrateRepositories(): Promise<{ message: string }> {
        await this.migrationService.migrateRepositories();
        return { message: 'Repositories migration completed' };
    }

    @Post('persons')
    @ApiOperation({ 
        summary: 'Миграция персон', 
        description: 'Перенос данных персон из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Персоны успешно мигрированы',
        schema: {
            example: { message: 'Persons migration completed' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции персон' 
    })
    async migratePersons(): Promise<{ message: string }> {
        await this.migrationService.migratePersons();
        return { message: 'Persons migration completed' };
    }

    @Post('users')
    @ApiOperation({ 
        summary: 'Миграция пользователей', 
        description: 'Перенос данных пользователей из Firebase в PostgreSQL' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Пользователи успешно мигрированы',
        schema: {
            example: { message: 'Users migration completed' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции пользователей' 
    })
    async migrateUsers(): Promise<{ message: string }> {
        await this.migrationService.migrateUsers();
        return { message: 'Users migration completed' };
    }

    @Get('navigation')
    @ApiOperation({ 
        summary: 'Получить мигрированную навигацию', 
        description: 'Возвращает список всей навигации из PostgreSQL' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список навигации успешно получен',
        type: [NavigationEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных навигации' 
    })
    async getMigratedNavigation(): Promise<NavigationEntity[]> {
        return this.migrationService.getMigratedNavigation();
    }

    @Get('hard-skills-nav')
    @ApiOperation({ 
        summary: 'Получить мигрированную hard skills навигацию', 
        description: 'Возвращает список hard skills навигации из PostgreSQL' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список hard skills навигации успешно получен',
        type: [HardSkillsNavEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных hard skills навигации' 
    })
    async getMigratedHardSkillsNav(): Promise<HardSkillsNavEntity[]> {
        return this.migrationService.getMigratedHardSkillsNav();
    }

    @Get('social-media')
    @ApiOperation({ 
        summary: 'Получить мигрированные социальные сети', 
        description: 'Возвращает список социальных сетей из PostgreSQL' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список социальных сетей успешно получен',
        type: [SocialMediaEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных социальных сетей' 
    })
    async getMigratedSocialMedia(): Promise<SocialMediaEntity[]> {
        return this.migrationService.getMigratedSocialMedia();
    }

    @Get('work-experience')
    @ApiOperation({ 
        summary: 'Получить мигрированный рабочий опыт', 
        description: 'Возвращает список рабочего опыта из PostgreSQL' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список рабочего опыта успешно получен',
        type: [WorkExperienceEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных рабочего опыта' 
    })
    async getMigratedWorkExperience(): Promise<WorkExperienceEntity[]> {
        return this.migrationService.getMigratedWorkExperience();
    }

    @Get('education-experience')
    @ApiOperation({ 
        summary: 'Получить мигрированный образовательный опыт', 
        description: 'Возвращает список образовательного опыта из PostgreSQL' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список образовательного опыта успешно получен',
        type: [EducationExperienceEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных образовательного опыта' 
    })
    async getMigratedEducationExperience(): Promise<EducationExperienceEntity[]> {
        return this.migrationService.getMigratedEducationExperience();
    }

    @Get('technologies')
    @ApiOperation({ 
        summary: 'Получить мигрированные технологии', 
        description: 'Возвращает список технологий из PostgreSQL с возможностью фильтрации по категории' 
    })
    @ApiQuery({ 
        name: 'category', 
        required: false, 
        enum: ['backend', 'frontend', 'other'],
        description: 'Фильтр по категории технологии' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список технологий успешно получен',
        type: [TechnologyEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных технологий' 
    })
    async getMigratedTechnologies(@Query('category') category?: string): Promise<TechnologyEntity[]> {
        return this.migrationService.getMigratedTechnologies(category);
    }

    @Get('technologies-aside')
    @ApiOperation({ 
        summary: 'Получить мигрированную боковую панель технологий', 
        description: 'Возвращает список боковой панели технологий из PostgreSQL' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список боковой панели технологий успешно получен',
        type: [TechnologiesAsideEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных боковой панели технологий' 
    })
    async getMigratedTechnologiesAside(): Promise<TechnologiesAsideEntity[]> {
        return this.migrationService.getMigratedTechnologiesAside();
    }

    @Get('experience-aside')
    @ApiOperation({ 
        summary: 'Получить мигрированную боковую панель опыта', 
        description: 'Возвращает список боковой панели опыта из PostgreSQL' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список боковой панели опыта успешно получен',
        type: [ExperienceAsideEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных боковой панели опыта' 
    })
    async getMigratedExperienceAside(): Promise<ExperienceAsideEntity[]> {
        return this.migrationService.getMigratedExperienceAside();
    }

    @Get('main-page-info')
    @ApiOperation({ 
        summary: 'Получить мигрированную информацию главной страницы', 
        description: 'Возвращает список информации главной страницы из PostgreSQL' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список информации главной страницы успешно получен',
        type: [MainPageInfoEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных главной страницы' 
    })
    async getMigratedMainPageInfo(): Promise<MainPageInfoEntity[]> {
        return this.migrationService.getMigratedMainPageInfo();
    }

    @Get('themeless-pictures')
    @ApiOperation({ 
        summary: 'Получить мигрированные тематические изображения', 
        description: 'Возвращает список тематических изображений из PostgreSQL' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список тематических изображений успешно получен',
        type: [ThemelessPicturesEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении тематических изображений' 
    })
    async getMigratedThemelessPictures(): Promise<ThemelessPicturesEntity[]> {
        return this.migrationService.getMigratedThemelessPictures();
    }

    @Get('projects')
    @ApiOperation({ 
        summary: 'Получить мигрированные проекты', 
        description: 'Возвращает список всех проектов из PostgreSQL' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список проектов успешно получен',
        type: [ProjectEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных проектов' 
    })
    async getMigratedProjects(): Promise<ProjectEntity[]> {
        return this.migrationService.getMigratedProjects();
    }

    @Get('repositories')
    @ApiOperation({ 
        summary: 'Получить мигрированные репозитории', 
        description: 'Возвращает список всех репозиториев из PostgreSQL' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список репозиториев успешно получен',
        type: [RepositoryMigrationEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных репозиториев' 
    })
    async getMigratedRepositories(): Promise<RepositoryMigrationEntity[]> {
        return this.migrationService.getMigratedRepositories();
    }

    @Get('persons')
    @ApiOperation({ 
        summary: 'Получить мигрированные персоны', 
        description: 'Возвращает список всех персон из PostgreSQL' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список персон успешно получен',
        type: [PersonEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных персон' 
    })
    async getMigratedPersons(): Promise<PersonEntity[]> {
        return this.migrationService.getMigratedPersons();
    }

    @Get('users')
    @ApiOperation({ 
        summary: 'Получить мигрированных пользователей', 
        description: 'Возвращает список всех пользователей из PostgreSQL' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список пользователей успешно получен',
        type: [UserEntity]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных пользователей' 
    })
    async getMigratedUsers(): Promise<UserEntity[]> {
        return this.migrationService.getMigratedUsers();
    }
}