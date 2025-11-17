import { Injectable } from '@nestjs/common';
import { getDocs, collection } from 'firebase/firestore';
import * as admin from 'firebase-admin';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { db } from '../utils/firebase.config';
import { ExperienceAsideClassDto } from '../../../dto/experience-aside-class.dto';
import { EducationExperienceClassDto } from '../../../dto/education-experience-class.dto';
import { HardSkillsNavigationClassDto } from '../../../dto/hard-skills-nav-class.dto';
import { MainPageInfoClassDto } from '../../../dto/main-page-info-class.dto';
import { NavigationClassDto } from '../../../dto/navigation-class.dto';
import { PersonClassDto } from '../../../dto/person-class.dto';
import { ProjectClassDto } from '../../../dto/project-class.dto';
import { ProjectsAsideClassDto } from '../../../dto/projects-aside-class.dto';
import { RepositoryClassDto } from '../../../dto/repository-class.dto';
import { SocialMediaClassDto } from '../../../dto/social-media-class.dto';
import { TechnologiesAsideClassDto } from '../../../dto/technologies-aside-class.dto';
import { TechnologiesClassDto } from '../../../dto/technologies-class.dto';
import { ThemelessPicturesClassDto } from '../../../dto/themeless-pictures-class.dto';
import { UserClassDto } from '../../../dto/user-class.dto';

@Injectable()
export class FirebaseService {
    private bucket: any;

    constructor() {
        this.bucket = admin.storage().bucket();
    }

    @ApiOperation({ 
        summary: 'Получить изображения из папки Firebase Storage',
        description: 'Возвращает массив URL подписанных изображений из указанной папки Firebase Storage'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список URL изображений',
        type: [String],
        example: ['https://storage.googleapis.com/.../image1.jpg', 'https://storage.googleapis.com/.../image2.jpg']
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении изображений из Firebase Storage' 
    })
    public async getImagesByFolder(folder: string): Promise<string[]> {
        try {
            const [files] = await this.bucket.getFiles({ prefix: folder });
            const urls = await Promise.all(
                files.map(async (file) => {
                    const [url] = await file.getSignedUrl({
                        action: 'read',
                        expires: '03-01-2500',
                    });
                    return url;
                }),
            );
            return urls;
        } catch (error) {
            console.error('Error getting images:', error);
            throw error;
        }
    }

    private async getCollectionData<T>(collectionName: string): Promise<T[]> {
        try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            return querySnapshot.docs.map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...doc.data(),
                    }) as T,
            );
        } catch (error) {
            console.error(`Error getting data from collection ${collectionName}:`, error);
            throw error;
        }
    }

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
        return this.getCollectionData<NavigationClassDto>('navigation');
    }

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
        return this.getCollectionData<HardSkillsNavigationClassDto>('hardSkillsNav');
    }

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
        return this.getCollectionData<SocialMediaClassDto>('socialMediaLinks');
    }

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
        return this.getCollectionData<EducationExperienceClassDto>('workExperience');
    }

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
        return this.getCollectionData<EducationExperienceClassDto>('educationExperience');
    }

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
        const workExperience = await this.getWorkExperience();
        const images = await this.getImagesByFolder('companies-logo');
        return workExperience.map((experience) => ({
            ...experience,
            iconPath: images.find((url) => url.includes(experience.alt || '')) || experience.iconPath || '',
        }));
    }

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
        const educationPlaces = await this.getEducationPlaces();
        const images = await this.getImagesByFolder('certificates');
        return educationPlaces.map((place) => ({
            ...place,
            iconPath: images.find((url) => url.includes(place.alt || '')) || place.iconPath || '',
        }));
    }

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
        return this.getCollectionData<TechnologiesClassDto>('backendTech');
    }

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
        return this.getCollectionData<TechnologiesClassDto>('frontendTech');
    }

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
        return this.getCollectionData<TechnologiesClassDto>('otherTech');
    }

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
        const backendTech = await this.getBackendTech();
        const images = await this.getImagesByFolder('technologies/backend');
        return backendTech.map((tech) => ({
            ...tech,
            iconPath: images.find((url) => url.includes(tech.alt)) || tech.iconPath,
        }));
    }

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
        const frontendTech = await this.getFrontendTech();
        const images = await this.getImagesByFolder('technologies/frontend');
        return frontendTech.map((tech) => ({
            ...tech,
            iconPath: images.find((url) => url.includes(tech.alt)) || tech.iconPath,
        }));
    }

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
        const otherTech = await this.getOtherTech();
        const images = await this.getImagesByFolder('technologies/other');
        return otherTech.map((tech) => ({
            ...tech,
            iconPath: images.find((url) => url.includes(tech.alt)) || tech.iconPath,
        }));
    }

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
        return this.getCollectionData<MainPageInfoClassDto>('mainPageInfo');
    }

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
        return this.getCollectionData<TechnologiesAsideClassDto>('technologiesAside');
    }

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
        return this.getCollectionData<ExperienceAsideClassDto>('experienceAside');
    }

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
        return this.getCollectionData<ThemelessPicturesClassDto>('themelessPictures');
    }

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
        return this.getCollectionData<ProjectClassDto>('projectsAside');
    }

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
        const projects = await this.getProjectsAside();
        const images = await this.getImagesByFolder('projects');
        return projects.map((project) => ({
            ...project,
            images: images.filter((url) => url.includes(project.alt || '')) || project.images || [],
        }));
    }

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
        return this.getCollectionData<RepositoryClassDto>('repositories');
    }

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
        return this.getCollectionData<PersonClassDto>('persons');
    }

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
        return this.getCollectionData<UserClassDto>('users');
    }

    @ApiOperation({ 
        summary: 'Получить aside проекты из Firebase',
        description: 'Возвращает aside проекты из коллекции projectsAside Firebase Firestore'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешно получен список aside проектов',
        type: [ProjectsAsideClassDto]
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при получении aside проектов из Firebase' 
    })
    async getProjectsAsideData(): Promise<ProjectsAsideClassDto[]> {
        return this.getCollectionData<ProjectsAsideClassDto>('projectsAside');
    }
}