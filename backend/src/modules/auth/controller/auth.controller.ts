import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { LoginClassDto, LoginResponseClassDto, GuestLoginResponseClassDto } from '../../../dto/auth-class.dto';
import { ExperienceAsideClassDto } from '../../../dto/experience-aside-class.dto';
import { EducationExperienceClassDto } from '../../../dto/education-experience-class.dto';
import { HardSkillsNavigationClassDto } from '../../../dto/hard-skills-nav-class.dto';
import { MainPageInfoClassDto } from '../../../dto/main-page-info-class.dto';
import { NavigationClassDto } from '../../../dto/navigation-class.dto';
import { PersonClassDto } from '../../../dto/person-class.dto';
import { ProjectClassDto } from '../../../dto/project-class.dto';
import { RepositoryClassDto } from '../../../dto/repository-class.dto';
import { SocialMediaClassDto } from '../../../dto/social-media-class.dto';
import { TechnologiesAsideClassDto } from '../../../dto/technologies-aside-class.dto';
import { TechnologiesClassDto } from '../../../dto/technologies-class.dto';
import { ThemelessPicturesClassDto } from '../../../dto/themeless-pictures-class.dto';
import { UserClassDto } from '../../../dto/user-class.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    @ApiOperation({ 
        summary: 'Аутентификация пользователя', 
        description: 'Вход пользователя с использованием email и пароля через Firebase Authentication' 
    })
    @ApiBody({ type: LoginClassDto })
    @ApiResponse({ 
        status: 201, 
        description: 'Успешная аутентификация',
        type: LoginResponseClassDto 
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Неверные учетные данные или отсутствуют обязательные поля' 
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Внутренняя ошибка сервера' 
    })
    async login(@Body() user: LoginClassDto): Promise<LoginResponseClassDto> {
        return this.authService.login(user);
    }

    @Post('guest-login')
    @ApiOperation({ 
        summary: 'Гостевая аутентификация', 
        description: 'Создание временной гостевой сессии без регистрации' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Гостевая сессия успешно создана',
        type: GuestLoginResponseClassDto 
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Ошибка создания гостевой сессии' 
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Внутренняя ошибка сервера' 
    })
    async guestLogin(): Promise<GuestLoginResponseClassDto> {
        return this.authService.guestLogin();
    }

    @Get('images/:folder')
    @ApiOperation({ 
        summary: 'Получить изображения из папки Firebase Storage',
        description: 'Возвращает массив URL подписанных изображений из указанной папки Firebase Storage'
    })
    @ApiParam({ name: 'folder', description: 'Название папки в Firebase Storage', example: 'technologies/backend' })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список URL изображений',
        type: [String]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении изображений из Firebase Storage' 
    })
    async getImagesByFolder(@Param('folder') folder: string): Promise<string[]> {
        return this.authService.getImagesByFolder(folder);
    }

    @Get('navigation')
    @ApiOperation({ 
        summary: 'Получить данные навигации из Firebase',
        description: 'Возвращает все элементы навигации из коллекции Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список элементов навигации',
        type: [NavigationClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных навигации из Firebase' 
    })
    async getNavigation(): Promise<NavigationClassDto[]> {
        return this.authService.getNavigation();
    }

    @Get('hard-skills-nav')
    @ApiOperation({ 
        summary: 'Получить навигацию hard skills из Firebase',
        description: 'Возвращает элементы навигации для раздела hard skills из Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список элементов навигации hard skills',
        type: [HardSkillsNavigationClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных навигации hard skills из Firebase' 
    })
    async getHardSkillsNav(): Promise<HardSkillsNavigationClassDto[]> {
        return this.authService.getHardSkillsNav();
    }

    @Get('social-media')
    @ApiOperation({ 
        summary: 'Получить ссылки на социальные сети из Firebase',
        description: 'Возвращает все ссылки на социальные сети из коллекции Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список социальных сетей',
        type: [SocialMediaClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных социальных сетей из Firebase' 
    })
    async getSocialMediaLinks(): Promise<SocialMediaClassDto[]> {
        return this.authService.getSocialMediaLinks();
    }

    @Get('work-experience')
    @ApiOperation({ 
        summary: 'Получить рабочий опыт из Firebase',
        description: 'Возвращает весь рабочий опыт из коллекции workExperience Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список рабочего опыта',
        type: [EducationExperienceClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных рабочего опыта из Firebase' 
    })
    async getWorkExperience(): Promise<EducationExperienceClassDto[]> {
        return this.authService.getWorkExperience();
    }

    @Get('education')
    @ApiOperation({ 
        summary: 'Получить образовательный опыт из Firebase',
        description: 'Возвращает весь образовательный опыт из коллекции educationExperience Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список образовательного опыта',
        type: [EducationExperienceClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении данных образовательного опыта из Firebase' 
    })
    async getEducationPlaces(): Promise<EducationExperienceClassDto[]> {
        return this.authService.getEducationPlaces();
    }

    @Get('work-experience-with-images')
    @ApiOperation({ 
        summary: 'Получить рабочий опыт с изображениями',
        description: 'Возвращает рабочий опыт с обновленными путями к изображениям из Firebase Storage'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список рабочего опыта с изображениями',
        type: [EducationExperienceClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении рабочего опыта с изображениями' 
    })
    async getWorkExperienceWithImages(): Promise<EducationExperienceClassDto[]> {
        return this.authService.getWorkExperienceWithImages();
    }

    @Get('education-with-images')
    @ApiOperation({ 
        summary: 'Получить образовательный опыт с изображениями',
        description: 'Возвращает образовательный опыт с обновленными путями к изображениям сертификатов из Firebase Storage'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список образовательного опыта с изображениями',
        type: [EducationExperienceClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении образовательного опыта с изображениями' 
    })
    async getEducationPlacesWithImages(): Promise<EducationExperienceClassDto[]> {
        return this.authService.getEducationPlacesWithImages();
    }

    @Get('backend-tech')
    @ApiOperation({ 
        summary: 'Получить backend технологии из Firebase',
        description: 'Возвращает список backend технологий из коллекции backendTech Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список backend технологий',
        type: [TechnologiesClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении backend технологий из Firebase' 
    })
    async getBackendTech(): Promise<TechnologiesClassDto[]> {
        return this.authService.getBackendTech();
    }

    @Get('frontend-tech')
    @ApiOperation({ 
        summary: 'Получить frontend технологии из Firebase',
        description: 'Возвращает список frontend технологий из коллекции frontendTech Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список frontend технологий',
        type: [TechnologiesClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении frontend технологий из Firebase' 
    })
    async getFrontendTech(): Promise<TechnologiesClassDto[]> {
        return this.authService.getFrontendTech();
    }

    @Get('other-tech')
    @ApiOperation({ 
        summary: 'Получить другие технологии из Firebase',
        description: 'Возвращает список других технологий из коллекции otherTech Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список других технологий',
        type: [TechnologiesClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении других технологий из Firebase' 
    })
    async getOtherTech(): Promise<TechnologiesClassDto[]> {
        return this.authService.getOtherTech();
    }

    @Get('backend-tech-with-images')
    @ApiOperation({ 
        summary: 'Получить backend технологии с изображениями',
        description: 'Возвращает backend технологии с обновленными путями к изображениям из Firebase Storage'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список backend технологий с изображениями',
        type: [TechnologiesClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении backend технологий с изображениями' 
    })
    async getBackendTechWithImages(): Promise<TechnologiesClassDto[]> {
        return this.authService.getBackendTechWithImages();
    }

    @Get('frontend-tech-with-images')
    @ApiOperation({ 
        summary: 'Получить frontend технологии с изображениями',
        description: 'Возвращает frontend технологии с обновленными путями к изображениям из Firebase Storage'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список frontend технологий с изображениями',
        type: [TechnologiesClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении frontend технологий с изображениями' 
    })
    async getFrontendTechWithImages(): Promise<TechnologiesClassDto[]> {
        return this.authService.getFrontendTechWithImages();
    }

    @Get('other-tech-with-images')
    @ApiOperation({ 
        summary: 'Получить другие технологии с изображениями',
        description: 'Возвращает другие технологии с обновленными путями к изображениям из Firebase Storage'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список других технологий с изображениями',
        type: [TechnologiesClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении других технологий с изображениями' 
    })
    async getOtherTechWithImages(): Promise<TechnologiesClassDto[]> {
        return this.authService.getOtherTechWithImages();
    }

    @Get('main-page-info')
    @ApiOperation({ 
        summary: 'Получить информацию главной страницы из Firebase',
        description: 'Возвращает информацию для главной страницы из коллекции mainPageInfo Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получена информация главной страницы',
        type: [MainPageInfoClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении информации главной страницы из Firebase' 
    })
    async getMainPageInfo(): Promise<MainPageInfoClassDto[]> {
        return this.authService.getMainPageInfo();
    }

    @Get('technologies-aside')
    @ApiOperation({ 
        summary: 'Получить боковую панель технологий из Firebase',
        description: 'Возвращает данные для боковой панели технологий из коллекции technologiesAside Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получена боковая панель технологий',
        type: [TechnologiesAsideClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении боковой панели технологий из Firebase' 
    })
    async getTechnologiesAside(): Promise<TechnologiesAsideClassDto[]> {
        return this.authService.getTechnologiesAside();
    }

    @Get('experience-aside')
    @ApiOperation({ 
        summary: 'Получить боковую панель опыта из Firebase',
        description: 'Возвращает данные для боковой панели опыта из коллекции experienceAside Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получена боковая панель опыта',
        type: [ExperienceAsideClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении боковой панели опыта из Firebase' 
    })
    async getExperienceAside(): Promise<ExperienceAsideClassDto[]> {
        return this.authService.getExperienceAside();
    }

    @Get('themeless-pictures')
    @ApiOperation({ 
        summary: 'Получить тематические изображения из Firebase',
        description: 'Возвращает тематические изображения из коллекции themelessPictures Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получены тематические изображения',
        type: [ThemelessPicturesClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении тематических изображений из Firebase' 
    })
    async getThemelessPictures(): Promise<ThemelessPicturesClassDto[]> {
        return this.authService.getThemelessPictures();
    }

    @Get('projects')
    @ApiOperation({ 
        summary: 'Получить проекты из Firebase',
        description: 'Возвращает все проекты из коллекции projectsAside Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список проектов',
        type: [ProjectClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении проектов из Firebase' 
    })
    async getProjectsAside(): Promise<ProjectClassDto[]> {
        return this.authService.getProjectsAside();
    }

    @Get('projects-with-images')
    @ApiOperation({ 
        summary: 'Получить проекты с изображениями',
        description: 'Возвращает проекты с обновленными путями к изображениям из Firebase Storage'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список проектов с изображениями',
        type: [ProjectClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении проектов с изображениями' 
    })
    async getProjectsAsideWithImages(): Promise<ProjectClassDto[]> {
        return this.authService.getProjectsAsideWithImages();
    }

    @Get('repositories')
    @ApiOperation({ 
        summary: 'Получить репозитории из Firebase',
        description: 'Возвращает все репозитории из коллекции repositories Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список репозиториев',
        type: [RepositoryClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении репозиториев из Firebase' 
    })
    async getRepositories(): Promise<RepositoryClassDto[]> {
        return this.authService.getRepositories();
    }

    @Get('persons')
    @ApiOperation({ 
        summary: 'Получить персоны из Firebase',
        description: 'Возвращает все персоны из коллекции persons Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список персон',
        type: [PersonClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении персон из Firebase' 
    })
    async getPersons(): Promise<PersonClassDto[]> {
        return this.authService.getPersons();
    }

    @Get('users')
    @ApiOperation({ 
        summary: 'Получить пользователей из Firebase',
        description: 'Возвращает всех пользователей из коллекции users Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список пользователей',
        type: [UserClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении пользователей из Firebase' 
    })
    async getUsers(): Promise<UserClassDto[]> {
        return this.authService.getUsers();
    }
}