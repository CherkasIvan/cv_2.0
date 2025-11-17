import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { FirebaseService } from '../service/firebase.service';
import { NavigationClassDto } from '../../../dto/navigation-class.dto';
import { SocialMediaClassDto } from '../../../dto/social-media-class.dto';
import { EducationExperienceClassDto } from '../../../dto/education-experience-class.dto';
import { TechnologiesClassDto } from '../../../dto/technologies-class.dto';
import { TechnologiesAsideClassDto } from '../../../dto/technologies-aside-class.dto';
import { ExperienceAsideClassDto } from '../../../dto/experience-aside-class.dto';
import { MainPageInfoClassDto } from '../../../dto/main-page-info-class.dto';
import { ThemelessPicturesClassDto } from '../../../dto/themeless-pictures-class.dto';
import { ProjectClassDto } from '../../../dto/project-class.dto';
import { RepositoryClassDto } from '../../../dto/repository-class.dto';
import { PersonClassDto } from '../../../dto/person-class.dto';
import { UserClassDto } from '../../../dto/user-class.dto';
import { HardSkillsNavigationClassDto } from '../../../dto/hard-skills-nav-class.dto';
import { ProjectsAsideClassDto } from '../../../dto/projects-aside-class.dto';

@ApiTags('firebase')
@Controller('firebase')
export class FirebaseController {
    constructor(private readonly firebaseService: FirebaseService) {}

    @Get('images/:folder')
    @ApiOperation({ 
        summary: 'Получить изображения из папки', 
        description: 'Возвращает список URL изображений из указанной папки Firebase Storage' 
    })
    @ApiParam({ 
        name: 'folder', 
        description: 'Название папки в Firebase Storage', 
        example: 'technologies/backend',
        required: true 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Список URL изображений успешно получен',
        schema: {
            example: [
                'https://storage.googleapis.com/bucket/technologies/backend/nodejs.png',
                'https://storage.googleapis.com/bucket/technologies/backend/nestjs.png'
            ]
        }
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Папка не найдена' 
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении изображений' 
    })
    async getImages(@Param('folder') folder: string): Promise<string[]> {
        return this.firebaseService.getImagesByFolder(folder);
    }

    @Get('navigation')
    @ApiOperation({ 
        summary: 'Получить навигацию из Firebase', 
        description: 'Возвращает данные навигации непосредственно из Firebase Firestore' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные навигации успешно получены',
        type: [NavigationClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении навигации' 
    })
    async getNavigation(): Promise<NavigationClassDto[]> {
        return this.firebaseService.getNavigation();
    }

    @Get('social-media-links')
    @ApiOperation({ 
        summary: 'Получить ссылки на социальные сети', 
        description: 'Возвращает данные социальных сетей из Firebase Firestore' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные социальных сетей успешно получены',
        type: [SocialMediaClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении социальных сетей' 
    })
    async getSocialMediaLinks(): Promise<SocialMediaClassDto[]> {
        return this.firebaseService.getSocialMediaLinks();
    }

    @Get('experience-aside')
    @ApiOperation({ 
        summary: 'Получить боковую панель опыта', 
        description: 'Возвращает данные боковой панели опыта из Firebase Firestore' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные боковой панели опыта успешно получены',
        type: [ExperienceAsideClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении боковой панели опыта' 
    })
    async getExperienceAside(): Promise<ExperienceAsideClassDto[]> {
        return this.firebaseService.getExperienceAside();
    }

    @Get('education-places')
    @ApiOperation({ 
        summary: 'Получить места образования с изображениями', 
        description: 'Возвращает данные об образовательных учреждениях с изображениями из Firebase' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные об образовательных учреждениях успешно получены',
        type: [EducationExperienceClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных об образовательных учреждениях' 
    })
    async getEducationPlacesWithImages(): Promise<EducationExperienceClassDto[]> {
        return this.firebaseService.getEducationPlacesWithImages();
    }

    @Get('work-experience')
    @ApiOperation({ 
        summary: 'Получить рабочий опыт с изображениями', 
        description: 'Возвращает данные о рабочем опыте с изображениями из Firebase' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные о рабочем опыте успешно получены',
        type: [EducationExperienceClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных о рабочем опыте' 
    })
    async getWorkExperienceWithImages(): Promise<EducationExperienceClassDto[]> {
        return this.firebaseService.getWorkExperienceWithImages();
    }

    @Get('backend')
    @ApiOperation({ 
        summary: 'Получить backend технологии с изображениями', 
        description: 'Возвращает данные о backend технологиях с изображениями из Firebase' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные о backend технологиях успешно получены',
        type: [TechnologiesClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных о backend технологиях' 
    })
    async getBackendTech(): Promise<TechnologiesClassDto[]> {
        return this.firebaseService.getBackendTechWithImages();
    }

    @Get('other')
    @ApiOperation({ 
        summary: 'Получить другие технологии с изображениями', 
        description: 'Возвращает данные о других технологиях с изображениями из Firebase' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные о других технологиях успешно получены',
        type: [TechnologiesClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных о других технологиях' 
    })
    async getOtherTech(): Promise<TechnologiesClassDto[]> {
        return this.firebaseService.getOtherTechWithImages();
    }

    @Get('frontend')
    @ApiOperation({ 
        summary: 'Получить frontend технологии с изображениями', 
        description: 'Возвращает данные о frontend технологиях с изображениями из Firebase' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные о frontend технологиях успешно получены',
        type: [TechnologiesClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных о frontend технологиях' 
    })
    async getFrontendTech(): Promise<TechnologiesClassDto[]> {
        return this.firebaseService.getFrontendTechWithImages();
    }

    @Get('hard-skills-nav')
    @ApiOperation({ 
        summary: 'Получить навигацию hard skills', 
        description: 'Возвращает данные навигации hard skills из Firebase Firestore' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные навигации hard skills успешно получены',
        type: [HardSkillsNavigationClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении навигации hard skills' 
    })
    async getHardSkillsNav(): Promise<HardSkillsNavigationClassDto[]> {
        return this.firebaseService.getHardSkillsNav();
    }

    @Get('main-page-info')
    @ApiOperation({ 
        summary: 'Получить информацию главной страницы', 
        description: 'Возвращает данные главной страницы из Firebase Firestore' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные главной страницы успешно получены',
        type: [MainPageInfoClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных главной страницы' 
    })
    async getMainPageInfo(): Promise<MainPageInfoClassDto[]> {
        return this.firebaseService.getMainPageInfo();
    }

    @Get('technologies-aside')
    @ApiOperation({ 
        summary: 'Получить боковую панель технологий', 
        description: 'Возвращает данные боковой панели технологий из Firebase Firestore' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные боковой панели технологий успешно получены',
        type: [TechnologiesAsideClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении боковой панели технологий' 
    })
    async getTechnologiesAside(): Promise<TechnologiesAsideClassDto[]> {
        return this.firebaseService.getTechnologiesAside();
    }

    @Get('projects-aside')
    @ApiOperation({ 
        summary: 'Получить проекты с изображениями', 
        description: 'Возвращает данные проектов с изображениями из Firebase' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные проектов успешно получены',
        type: [ProjectClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных проектов' 
    })
    async getProjectsAside(): Promise<ProjectClassDto[]> {
        return this.firebaseService.getProjectsAsideWithImages();
    }

    @Get('projects-aside-data')
    @ApiOperation({ 
        summary: 'Получить aside проекты', 
        description: 'Возвращает данные aside проектов из Firebase Firestore' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные aside проектов успешно получены',
        type: [ProjectsAsideClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных aside проектов' 
    })
    async getProjectsAsideData(): Promise<ProjectsAsideClassDto[]> {
        return this.firebaseService.getProjectsAsideData();
    }

    @Get('repositories')
    @ApiOperation({ 
        summary: 'Получить репозитории', 
        description: 'Возвращает данные репозиториев из Firebase Firestore' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные репозиториев успешно получены',
        type: [RepositoryClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных репозиториев' 
    })
    async getRepositories(): Promise<RepositoryClassDto[]> {
        return this.firebaseService.getRepositories();
    }

    @Get('persons')
    @ApiOperation({ 
        summary: 'Получить персоны', 
        description: 'Возвращает данные персон из Firebase Firestore' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные персон успешно получены',
        type: [PersonClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных персон' 
    })
    async getPersons(): Promise<PersonClassDto[]> {
        return this.firebaseService.getPersons();
    }

    @Get('users')
    @ApiOperation({ 
        summary: 'Получить пользователей', 
        description: 'Возвращает данные пользователей из Firebase Firestore' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные пользователей успешно получены',
        type: [UserClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных пользователей' 
    })
    async getUsers(): Promise<UserClassDto[]> {
        return this.firebaseService.getUsers();
    }

    @Get('themeless-pictures')
    @ApiOperation({ 
        summary: 'Получить тематические изображения', 
        description: 'Возвращает данные тематических изображений из Firebase Firestore' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Данные тематических изображений успешно получены',
        type: [ThemelessPicturesClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных тематических изображений' 
    })
    async getThemelessPictures(): Promise<ThemelessPicturesClassDto[]> {
        return this.firebaseService.getThemelessPictures();
    }
}