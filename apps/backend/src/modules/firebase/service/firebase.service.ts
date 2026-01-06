import * as admin from 'firebase-admin';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
    updateDoc,
} from 'firebase/firestore';

import { Injectable } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { db } from '../../../config/firebase.config';
import { EducationExperienceClassDto } from '../../../shared/dto/education-experience-class.dto';
import { ExperienceAsideClassDto } from '../../../shared/dto/experience-aside-class.dto';
import { HardSkillsNavigationClassDto } from '../../../shared/dto/hard-skills-nav-class.dto';
import { MainPageInfoClassDto } from '../../../shared/dto/main-page-info-class.dto';
import { NavigationClassDto } from '../../../shared/dto/navigation-class.dto';
import { PersonClassDto } from '../../../shared/dto/person-class.dto';
import { ProjectClassDto } from '../../../shared/dto/project-class.dto';
import { ProjectsAsideClassDto } from '../../../shared/dto/projects-aside-class.dto';
import { RepositoryClassDto } from '../../../shared/dto/repository-class.dto';
import { SocialMediaClassDto } from '../../../shared/dto/social-media-class.dto';
import { TechnologiesAsideClassDto } from '../../../shared/dto/technologies-aside-class.dto';
import { TechnologiesClassDto } from '../../../shared/dto/technologies-class.dto';
import { ThemelessPicturesClassDto } from '../../../shared/dto/themeless-pictures-class.dto';

@Injectable()
export class FirebaseService {
    private bucket: any;

    constructor() {
        this.bucket = admin.storage().bucket();
    }

    @ApiOperation({
        summary: 'Получить изображения из папки Firebase Storage',
        description:
            'Возвращает массив URL подписанных изображений из указанной папки Firebase Storage',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список URL изображений',
        type: [String],
        example: [
            'https://storage.googleapis.com/.../image1.jpg',
            'https://storage.googleapis.com/.../image2.jpg',
        ],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении изображений из Firebase Storage',
    })
    public async getImagesByFolder(folder: string): Promise<string[]> {
        try {
            if (folder && !folder.endsWith('/')) {
                folder = folder + '/';
            }
            console.log(`🔄 Getting images from folder: "${folder}"`);

            // Проверяем существование папки
            const [files] = await this.bucket.getFiles({ prefix: folder });
            console.log(
                `📁 Found ${files.length} total files in folder "${folder}"`,
            );

            // Детальная информация о файлах
            if (files.length > 0) {
                console.log(`📋 Files in folder "${folder}":`);
                files.forEach((file, index) => {
                    console.log(
                        `  ${index + 1}. ${file.name} (${file.metadata?.contentType || 'unknown type'})`,
                    );
                });
            }

            // ✅ ДОБАВЛЕНО: проверка на пустую папку
            if (files.length === 0) {
                console.log(`⚠️ Folder "${folder}" exists but is empty`);
                return [];
            }

            // Фильтруем только файлы изображений
            const imageFiles = files.filter((file) => {
                const isFile = !file.name.endsWith('/');
                const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(
                    file.name,
                );
                const isInExactFolder =
                    file.name.startsWith(folder) && file.name !== folder;

                return isFile && isImage && isInExactFolder;
            });

            console.log(
                `🖼️ Found ${imageFiles.length} image files in folder "${folder}"`,
            );

            if (imageFiles.length === 0) {
                console.log(`❌ No image files found in folder "${folder}"`);

                // Дополнительная диагностика - какие файлы есть в папке
                const allFiles = files.filter(
                    (file) => !file.name.endsWith('/'),
                );
                if (allFiles.length > 0) {
                    console.log(`📄 Non-image files in folder:`);
                    allFiles.forEach((file) => {
                        console.log(
                            `  - ${file.name} (${file.metadata?.contentType || 'unknown'})`,
                        );
                    });
                }

                return [];
            }

            // Генерируем подписанные URL
            const urls = await Promise.all(
                imageFiles.map(async (file) => {
                    try {
                        const [url] = await file.getSignedUrl({
                            action: 'read',
                            expires: '03-01-2500',
                        });
                        console.log(`✅ Generated URL for: ${file.name}`);
                        return url;
                    } catch (error) {
                        console.error(
                            `❌ Error generating URL for file ${file.name}:`,
                            error,
                        );
                        return null;
                    }
                }),
            );

            // Фильтруем null значения
            const validUrls = urls.filter((url) => url !== null) as string[];

            console.log(
                `🎉 Generated ${validUrls.length} valid URLs for folder "${folder}"`,
            );
            return validUrls;
        } catch (error) {
            console.error(
                `💥 Error getting images from folder "${folder}":`,
                error,
            );
            // ✅ ВОЗВРАЩАЕМ пустой массив вместо выбрасывания ошибки
            return [];
        }
    }

    public async debugFolderStructure(baseFolder: string = ''): Promise<void> {
        try {
            console.log(`🔍 Debugging folder structure for: "${baseFolder}"`);

            const [files] = await this.bucket.getFiles({ prefix: baseFolder });

            console.log(`📊 Total files/folders: ${files.length}`);

            // Группируем по папкам
            const folders = new Map<string, string[]>();

            files.forEach((file) => {
                const pathParts = file.name
                    .split('/')
                    .filter((part) => part.length > 0);

                if (pathParts.length > 0) {
                    const folderName = pathParts[0];
                    if (!folders.has(folderName)) {
                        folders.set(folderName, []);
                    }
                    folders.get(folderName)!.push(file.name);
                }
            });

            console.log(`📂 Found ${folders.size} top-level folders:`);
            folders.forEach((files, folder) => {
                console.log(`  📁 ${folder}/ (${files.length} items)`);
                files.slice(0, 5).forEach((file) => {
                    // Показываем первые 5 файлов
                    console.log(`    📄 ${file}`);
                });
                if (files.length > 5) {
                    console.log(`    ... and ${files.length - 5} more files`);
                }
            });
        } catch (error) {
            console.error('Error debugging folder structure:', error);
        }
    }

    public async checkFolderExists(folder: string): Promise<boolean> {
        try {
            if (folder && !folder.endsWith('/')) {
                folder = folder + '/';
            }

            const [files] = await this.bucket.getFiles({
                prefix: folder,
                maxResults: 1, // Проверяем только наличие хотя бы одного файла
            });

            return files.length > 0;
        } catch (error) {
            console.error('Error checking folder existence:', error);
            return false;
        }
    }
    @ApiOperation({
        summary: 'Удалить пользователя из Firebase',
        description:
            'Удаляет пользователя из коллекции users Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Пользователь успешно удален',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при удалении пользователя из Firebase',
    })
    public async deleteUser(uid: string): Promise<any> {
        try {
            const userRef = doc(db, 'users', uid);
            await deleteDoc(userRef);
            return { message: 'User deleted successfully', uid };
        } catch (error) {
            console.error('Error deleting user:', error);
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
            console.error(
                `Error getting data from collection ${collectionName}:`,
                error,
            );
            throw error;
        }
    }

    @ApiOperation({
        summary: 'Получить данные навигации из Firebase',
        description:
            'Возвращает все элементы навигации из коллекции Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список элементов навигации',
        type: [NavigationClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении данных навигации из Firebase',
    })
    async getNavigation(): Promise<NavigationClassDto[]> {
        return this.getCollectionData<NavigationClassDto>('navigation');
    }

    @ApiOperation({
        summary: 'Получить навигацию hard skills из Firebase',
        description:
            'Возвращает элементы навигации для раздела hard skills из Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список элементов навигации hard skills',
        type: [HardSkillsNavigationClassDto],
    })
    @ApiResponse({
        status: 500,
        description:
            'Ошибка при получении данных навигации hard skills из Firebase',
    })
    async getHardSkillsNav(): Promise<HardSkillsNavigationClassDto[]> {
        return this.getCollectionData<HardSkillsNavigationClassDto>(
            'hardSkillsNav',
        );
    }

    @ApiOperation({
        summary: 'Получить ссылки на социальные сети из Firebase',
        description:
            'Возвращает все ссылки на социальные сети из коллекции Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список социальных сетей',
        type: [SocialMediaClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении данных социальных сетей из Firebase',
    })
    async getSocialMediaLinks(): Promise<SocialMediaClassDto[]> {
        return this.getCollectionData<SocialMediaClassDto>('socialMediaLinks');
    }

    @ApiOperation({
        summary: 'Получить рабочий опыт из Firebase',
        description:
            'Возвращает весь рабочий опыт из коллекции workExperience Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список рабочего опыта',
        type: [EducationExperienceClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении данных рабочего опыта из Firebase',
    })
    async getWorkExperience(): Promise<EducationExperienceClassDto[]> {
        return this.getCollectionData<EducationExperienceClassDto>(
            'workExperience',
        );
    }

    @ApiOperation({
        summary: 'Получить образовательный опыт из Firebase',
        description:
            'Возвращает весь образовательный опыт из коллекции educationExperience Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список образовательного опыта',
        type: [EducationExperienceClassDto],
    })
    @ApiResponse({
        status: 500,
        description:
            'Ошибка при получении данных образовательного опыта из Firebase',
    })
    async getEducationPlaces(): Promise<EducationExperienceClassDto[]> {
        return this.getCollectionData<EducationExperienceClassDto>(
            'educationExperience',
        );
    }

    @ApiOperation({
        summary: 'Получить рабочий опыт с изображениями',
        description:
            'Возвращает рабочий опыт с обновленными путями к изображениям из Firebase Storage',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список рабочего опыта с изображениями',
        type: [EducationExperienceClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении рабочего опыта с изображениями',
    })
    async getWorkExperienceWithImages(): Promise<
        EducationExperienceClassDto[]
    > {
        const workExperience = await this.getWorkExperience();
        const images = await this.getImagesByFolder('companies-logo');
        return workExperience.map((experience) => ({
            ...experience,
            iconPath:
                images.find((url) => url.includes(experience.alt || '')) ||
                experience.iconPath ||
                '',
        }));
    }

    @ApiOperation({
        summary: 'Получить образовательный опыт с изображениями',
        description:
            'Возвращает образовательный опыт с обновленными путями к изображениям сертификатов из Firebase Storage',
    })
    @ApiResponse({
        status: 200,
        description:
            'Успешно получен список образовательного опыта с изображениями',
        type: [EducationExperienceClassDto],
    })
    @ApiResponse({
        status: 500,
        description:
            'Ошибка при получении образовательного опыта с изображениями',
    })
    async getEducationPlacesWithImages(): Promise<
        EducationExperienceClassDto[]
    > {
        const educationPlaces = await this.getEducationPlaces();
        const images = await this.getImagesByFolder('certificates');
        return educationPlaces.map((place) => ({
            ...place,
            iconPath:
                images.find((url) => url.includes(place.alt || '')) ||
                place.iconPath ||
                '',
        }));
    }

    @ApiOperation({
        summary: 'Получить backend технологии из Firebase',
        description:
            'Возвращает список backend технологий из коллекции backendTech Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список backend технологий',
        type: [TechnologiesClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении backend технологий из Firebase',
    })
    async getBackendTech(): Promise<TechnologiesClassDto[]> {
        return this.getCollectionData<TechnologiesClassDto>('backendTech');
    }

    @ApiOperation({
        summary: 'Получить frontend технологии из Firebase',
        description:
            'Возвращает список frontend технологий из коллекции frontendTech Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список frontend технологий',
        type: [TechnologiesClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении frontend технологий из Firebase',
    })
    async getFrontendTech(): Promise<TechnologiesClassDto[]> {
        return this.getCollectionData<TechnologiesClassDto>('frontendTech');
    }

    @ApiOperation({
        summary: 'Получить другие технологии из Firebase',
        description:
            'Возвращает список других технологий из коллекции otherTech Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список других технологий',
        type: [TechnologiesClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении других технологий из Firebase',
    })
    async getOtherTech(): Promise<TechnologiesClassDto[]> {
        return this.getCollectionData<TechnologiesClassDto>('otherTech');
    }

    @ApiOperation({
        summary: 'Получить backend технологии с изображениями',
        description:
            'Возвращает backend технологии с обновленными путями к изображениям из Firebase Storage',
    })
    @ApiResponse({
        status: 200,
        description:
            'Успешно получен список backend технологий с изображениями',
        type: [TechnologiesClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении backend технологий с изображениями',
    })
    async getBackendTechWithImages(): Promise<TechnologiesClassDto[]> {
        const backendTech = await this.getBackendTech();
        const images = await this.getImagesByFolder('technologies/backend');
        return backendTech.map((tech) => ({
            ...tech,
            iconPath:
                images.find((url) => url.includes(tech.alt)) || tech.iconPath,
        }));
    }

    @ApiOperation({
        summary: 'Получить frontend технологии с изображениями',
        description:
            'Возвращает frontend технологии с обновленными путями к изображениям из Firebase Storage',
    })
    @ApiResponse({
        status: 200,
        description:
            'Успешно получен список frontend технологий с изображениями',
        type: [TechnologiesClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении frontend технологий с изображениями',
    })
    async getFrontendTechWithImages(): Promise<TechnologiesClassDto[]> {
        const frontendTech = await this.getFrontendTech();
        const images = await this.getImagesByFolder('technologies/frontend');
        return frontendTech.map((tech) => ({
            ...tech,
            iconPath:
                images.find((url) => url.includes(tech.alt)) || tech.iconPath,
        }));
    }

    @ApiOperation({
        summary: 'Получить другие технологии с изображениями',
        description:
            'Возвращает другие технологии с обновленными путями к изображениям из Firebase Storage',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список других технологий с изображениями',
        type: [TechnologiesClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении других технологий с изображениями',
    })
    async getOtherTechWithImages(): Promise<TechnologiesClassDto[]> {
        const otherTech = await this.getOtherTech();
        const images = await this.getImagesByFolder('technologies/other');
        return otherTech.map((tech) => ({
            ...tech,
            iconPath:
                images.find((url) => url.includes(tech.alt)) || tech.iconPath,
        }));
    }

    @ApiOperation({
        summary: 'Получить информацию главной страницы из Firebase',
        description:
            'Возвращает информацию для главной страницы из коллекции mainPageInfo Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получена информация главной страницы',
        type: [MainPageInfoClassDto],
    })
    @ApiResponse({
        status: 500,
        description:
            'Ошибка при получении информации главной страницы из Firebase',
    })
    async getMainPageInfo(): Promise<MainPageInfoClassDto[]> {
        return this.getCollectionData<MainPageInfoClassDto>('mainPageInfo');
    }

    @ApiOperation({
        summary: 'Получить боковую панель технологий из Firebase',
        description:
            'Возвращает данные для боковой панели технологий из коллекции technologiesAside Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получена боковая панель технологий',
        type: [TechnologiesAsideClassDto],
    })
    @ApiResponse({
        status: 500,
        description:
            'Ошибка при получении боковой панели технологий из Firebase',
    })
    async getTechnologiesAside(): Promise<TechnologiesAsideClassDto[]> {
        return this.getCollectionData<TechnologiesAsideClassDto>(
            'technologiesAside',
        );
    }

    @ApiOperation({
        summary: 'Получить боковую панель опыта из Firebase',
        description:
            'Возвращает данные для боковой панели опыта из коллекции experienceAside Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получена боковая панель опыта',
        type: [ExperienceAsideClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении боковой панели опыта из Firebase',
    })
    async getExperienceAside(): Promise<ExperienceAsideClassDto[]> {
        return this.getCollectionData<ExperienceAsideClassDto>(
            'experienceAside',
        );
    }

    @ApiOperation({
        summary: 'Получить тематические изображения из Firebase',
        description:
            'Возвращает тематические изображения из коллекции themelessPictures Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получены тематические изображения',
        type: [ThemelessPicturesClassDto],
    })
    @ApiResponse({
        status: 500,
        description:
            'Ошибка при получении тематических изображений из Firebase',
    })
    async getThemelessPictures(): Promise<ThemelessPicturesClassDto[]> {
        return this.getCollectionData<ThemelessPicturesClassDto>(
            'themelessPictures',
        );
    }

    @ApiOperation({
        summary: 'Получить проекты из Firebase',
        description:
            'Возвращает все проекты из коллекции projectsAside Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список проектов',
        type: [ProjectClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении проектов из Firebase',
    })
    async getProjectsAside(): Promise<ProjectClassDto[]> {
        return this.getCollectionData<ProjectClassDto>('projectsAside');
    }

    @ApiOperation({
        summary: 'Получить проекты с изображениями',
        description:
            'Возвращает проекты с обновленными путями к изображениям из Firebase Storage',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список проектов с изображениями',
        type: [ProjectClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении проектов с изображениями',
    })
    async getProjectsAsideWithImages(): Promise<ProjectClassDto[]> {
        const projects = await this.getProjectsAside();
        const images = await this.getImagesByFolder('projects');
        return projects.map((project) => ({
            ...project,
            images:
                images.filter((url) => url.includes(project.alt || '')) ||
                project.images ||
                [],
        }));
    }

    @ApiOperation({
        summary: 'Получить репозитории из Firebase',
        description:
            'Возвращает все репозитории из коллекции repositories Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список репозиториев',
        type: [RepositoryClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении репозиториев из Firebase',
    })
    async getRepositories(): Promise<RepositoryClassDto[]> {
        return this.getCollectionData<RepositoryClassDto>('repositories');
    }

    @ApiOperation({
        summary: 'Получить персоны из Firebase',
        description:
            'Возвращает все персоны из коллекции persons Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список персон',
        type: [PersonClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении персон из Firebase',
    })
    async getPersons(): Promise<PersonClassDto[]> {
        return this.getCollectionData<PersonClassDto>('persons');
    }

    @ApiOperation({
        summary: 'Получить aside проекты из Firebase',
        description:
            'Возвращает aside проекты из коллекции projectsAside Firebase Firestore',
    })
    @ApiResponse({
        status: 200,
        description: 'Успешно получен список aside проектов',
        type: [ProjectsAsideClassDto],
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при получении aside проектов из Firebase',
    })
    async getProjectsAsideData(): Promise<ProjectsAsideClassDto[]> {
        return this.getCollectionData<ProjectsAsideClassDto>('projectsAside');
    }
}
