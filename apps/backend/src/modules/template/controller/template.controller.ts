import { ExperienceAsideEntity } from '@shared/entities/experience-aside.entity';
import { HardSkillsNavEntity } from '@shared/entities/hard-skills-nav.entity';
import { MainPageInfoEntity } from '@shared/entities/main-page-info.entity';
import { NavigationEntity } from '@shared/entities/navigation.entity';
import { SocialMediaEntity } from '@shared/entities/social-media.entity';
import { TechnologiesAsideEntity } from '@shared/entities/technologies-aside.entity';

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TemplateService } from '../service/template.service';

@ApiTags('template')
@Controller('template')
export class TemplateController {
    constructor(private readonly templateService: TemplateService) {}

    @Get('main-page-info')
    @ApiOperation({
        summary: 'Получить информацию главной страницы',
        description: 'Возвращает данные главной страницы из Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Данные главной страницы успешно получены',
        type: [MainPageInfoEntity],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении данных главной страницы',
    })
    async getMainPageInfo(): Promise<MainPageInfoEntity[]> {
        return this.templateService.getMainPageInfo();
    }

    @Get('navigation')
    @ApiOperation({
        summary: 'Получить шаблон навигации из PostgreSQL',
        description:
            'Возвращает данные навигации для шаблона из локальной PostgreSQL базы',
    })
    @ApiResponse({
        status: 200,
        description: 'Шаблон навигации успешно получен',
        type: [NavigationEntity],
    })
    async getNavigation(): Promise<NavigationEntity[]> {
        return this.templateService.getNavigation();
    }

    @Get('social-media')
    @ApiOperation({
        summary: 'Получить шаблон социальных сетей из PostgreSQL',
        description:
            'Возвращает данные социальных сетей для шаблона из локальной PostgreSQL базы',
    })
    @ApiResponse({
        status: 200,
        description: 'Шаблон социальных сетей успешно получен',
        type: [SocialMediaEntity],
    })
    async getSocialMedia(): Promise<SocialMediaEntity[]> {
        return this.templateService.getSocialMedia();
    }

    @Get('experience-aside')
    @ApiOperation({
        summary: 'Получить боковую панель опыта',
        description:
            'Возвращает данные боковой панели опыта из Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Данные боковой панели опыта успешно получены',
        type: [ExperienceAsideEntity],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении боковой панели опыта',
    })
    async getHardSkillsNav(): Promise<ExperienceAsideEntity[]> {
        return this.templateService.getExperienceAside();
    }

    @Get('technologies-aside')
    @ApiOperation({
        summary: 'Получить боковую панель технологий',
        description:
            'Возвращает данные для боковой панели технологий из коллекции',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получена боковая панель технологий',
        type: [TechnologiesAsideEntity],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении боковой панели технологий',
    })
    async getTechnologiesAside(): Promise<TechnologiesAsideEntity[]> {
        return this.templateService.getTechnologiesAside();
    }

    @Get('hard-skills-nav')
    @ApiOperation({
        summary: 'Получить боковую панель опыта',
        description:
            'Возвращает данные боковой панели опыта из Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Данные боковой панели опыта успешно получены',
        type: [HardSkillsNavEntity],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении боковой панели опыта',
    })
    async getExperienceAside(): Promise<HardSkillsNavEntity[]> {
        return this.templateService.getHardSkillsNav();
    }

    @Get(':templateName')
    @ApiOperation({
        summary: 'Получить шаблон по имени',
        description: 'Возвращает данные шаблона по его имени из PostgreSQL',
    })
    @ApiResponse({
        status: 200,
        description: 'Шаблон успешно получен',
    })
    async getTemplate(templateName: string): Promise<any> {
        return this.templateService.getTemplateData(templateName);
    }

    @Get('technologies-with-skills')
    @ApiOperation({
        summary: 'Получить технологии с подменю',
        description: 'Возвращает технологии вместе с hard skills навигацией',
    })
    async getTechnologiesWithSkills(): Promise<any[]> {
        const technologies = await this.templateService.getTechnologiesAside();
        const result = [];

        for (const tech of technologies) {
            const hardSkills =
                await this.templateService.getHardSkillsByTechnologyId(tech.id);
            result.push({
                ...tech,
                hardSkills,
            });
        }

        return result;
    }
}
