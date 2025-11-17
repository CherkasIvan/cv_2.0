// src/modules/migration/service/migration.service.ts
import { Repository } from 'typeorm';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { FirebaseService } from '../../firebase/service/firebase.service';
import { NavigationEntity } from '../../../entities/navigation.entity';
import { SocialMediaEntity } from '../../../entities/social-media.entity';
import { WorkExperienceEntity } from '../../../entities/work-experience.entity';
import { EducationExperienceEntity } from '../../../entities/education-experience.entity';
import { TechnologyEntity } from '../../../entities/technology.entity';
import { MainPageInfoEntity } from '../../../entities/main-page-info.entity';
import { ProjectEntity } from '../../../entities/project.entity';
import { RepositoryMigrationEntity } from '../../../entities/repository-migration.entity';
import { PersonEntity } from '../../../entities/person.entity';
import { UserEntity } from '../../../entities/user.entity';
import { HardSkillsNavEntity } from '../../../entities/hard-skills-nav.entity';
import { TechnologiesAsideEntity } from '../../../entities/technologies-aside.entity';
import { ExperienceAsideEntity } from '../../../entities/experience-aside.entity';
import { ThemelessPicturesEntity } from '../../../entities/themeless-pictures.entity';

@Injectable()
export class MigrationService implements OnModuleInit {
    constructor(
        @InjectRepository(NavigationEntity)
        private navigationRepository: Repository<NavigationEntity>,
        @InjectRepository(SocialMediaEntity)
        private socialMediaRepository: Repository<SocialMediaEntity>,
        @InjectRepository(WorkExperienceEntity)
        private workExperienceRepository: Repository<WorkExperienceEntity>,
        @InjectRepository(EducationExperienceEntity)
        private educationRepository: Repository<EducationExperienceEntity>,
        @InjectRepository(TechnologyEntity)
        private technologyRepository: Repository<TechnologyEntity>,
        @InjectRepository(MainPageInfoEntity)
        private mainPageInfoRepository: Repository<MainPageInfoEntity>,
        @InjectRepository(ProjectEntity)
        private projectRepository: Repository<ProjectEntity>,
        @InjectRepository(RepositoryMigrationEntity)
        private repositoryRepository: Repository<RepositoryMigrationEntity>,
        @InjectRepository(PersonEntity)
        private personRepository: Repository<PersonEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(HardSkillsNavEntity)
        private hardSkillsNavRepository: Repository<HardSkillsNavEntity>,
        @InjectRepository(TechnologiesAsideEntity)
        private technologiesAsideRepository: Repository<TechnologiesAsideEntity>,
        @InjectRepository(ExperienceAsideEntity)
        private experienceAsideRepository: Repository<ExperienceAsideEntity>,
        @InjectRepository(ThemelessPicturesEntity)
        private themelessPicturesRepository: Repository<ThemelessPicturesEntity>,
        private firebaseService: FirebaseService,
    ) {}

    async onModuleInit() {
        if (process.env.AUTO_MIGRATE === 'true') {
            console.log('Auto-migration enabled. Starting migration...');
            try {
                await this.migrateAllData();
            } catch (error) {
                console.error('Auto-migration failed:', error);
            }
        }
    }

    @ApiOperation({ 
        summary: 'Запуск полной миграции данных', 
        description: 'Выполняет полную миграцию всех данных из Firebase Firestore и Storage в PostgreSQL базу данных'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция успешно завершена',
        schema: {
            example: { message: 'All migrations completed successfully' }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при выполнении миграции' 
    })
    async migrateAllData(): Promise<{ message: string }> {
        try {
            console.log('Starting complete data migration from Firebase to PostgreSQL...');

            // Мигрируем данные последовательно
            await this.migrateNavigation();
            await this.migrateHardSkillsNav();
            await this.migrateSocialMedia();
            await this.migrateExperience();
            await this.migrateTechnologiesAside();
            await this.migrateExperienceAside();
            await this.migrateTechnologies();
            await this.migrateMainPageInfo();
            await this.migrateThemelessPictures();
            await this.migrateProjects();
            await this.migrateRepositories();
            await this.migratePersons();
            await this.migrateUsers();

            console.log('All migrations completed successfully');
            return { message: 'All migrations completed successfully' };
        } catch (error) {
            console.error('Migration failed:', error);
            throw error;
        }
    }

    @ApiOperation({ 
        summary: 'Миграция навигации', 
        description: 'Мигрирует данные навигации из Firebase в PostgreSQL'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция навигации успешно завершена'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции навигации' 
    })
    async migrateNavigation(): Promise<void> {
        try {
            console.log('Migrating navigation...');
            const firebaseNavigation = await this.firebaseService.getNavigation();
            
            // Очищаем таблицу
            await this.navigationRepository.clear();

            // Сохраняем новые данные
            for (const navItem of firebaseNavigation) {
                const navigationEntity = this.navigationRepository.create({
                    link: navItem.link,
                    position: navItem.position,
                    value: navItem.value,
                    imgName: navItem.imgName || '',
                    images: navItem.images || [],
                });
                await this.navigationRepository.save(navigationEntity);
            }
            console.log(`Migrated ${firebaseNavigation.length} navigation items`);
        } catch (error) {
            console.error('Navigation migration failed:', error);
            throw error;
        }
    }

    @ApiOperation({ 
        summary: 'Миграция hard skills навигации', 
        description: 'Мигрирует данные hard skills навигации из Firebase в PostgreSQL'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция hard skills навигации успешно завершена'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции hard skills навигации' 
    })
    async migrateHardSkillsNav(): Promise<void> {
        try {
            console.log('Migrating hard skills navigation...');
            const hardSkillsNav = await this.firebaseService.getHardSkillsNav();
            await this.hardSkillsNavRepository.clear();

            for (const navItem of hardSkillsNav) {
                const hardSkillsNavEntity = this.hardSkillsNavRepository.create({
                    link: navItem.link,
                    value: navItem.value,
                });
                await this.hardSkillsNavRepository.save(hardSkillsNavEntity);
            }
            console.log(`Migrated ${hardSkillsNav.length} hard skills navigation items`);
        } catch (error) {
            console.error('Hard skills navigation migration failed:', error);
            throw error;
        }
    }

    @ApiOperation({ 
        summary: 'Миграция социальных сетей', 
        description: 'Мигрирует данные социальных сетей из Firebase в PostgreSQL'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция социальных сетей успешно завершена'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции социальных сетей' 
    })
    async migrateSocialMedia(): Promise<void> {
        try {
            console.log('Migrating social media...');
            const firebaseSocialMedia = await this.firebaseService.getSocialMediaLinks();
            await this.socialMediaRepository.clear();

            for (const socialItem of firebaseSocialMedia) {
                const socialEntity = this.socialMediaRepository.create({
                    link: socialItem.link,
                    value: socialItem.value,
                    imgName: socialItem.imgName,
                    images: socialItem.images || [],
                });
                await this.socialMediaRepository.save(socialEntity);
            }
            console.log(`Migrated ${firebaseSocialMedia.length} social media items`);
        } catch (error) {
            console.error('Social media migration failed:', error);
            throw error;
        }
    }

    @ApiOperation({ 
        summary: 'Миграция опыта работы и образования', 
        description: 'Мигрирует данные рабочего и образовательного опыта из Firebase в PostgreSQL'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция опыта работы и образования успешно завершена'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции опыта работы и образования' 
    })
async migrateExperience(): Promise<void> {
    try {
        console.log('Migrating experience data...');

        const workExperience = await this.firebaseService.getWorkExperienceWithImages();
        const educationExperience = await this.firebaseService.getEducationPlacesWithImages();

        await this.workExperienceRepository.clear();
        await this.educationRepository.clear();

        // Сохраняем work experience
        for (const exp of workExperience) {
                const experienceEntity = this.workExperienceRepository.create({
                logoPath: exp.logoPath || '',
                alt: exp.alt || '',
                iconPath: exp.iconPath || '',
                company: exp.company || 'Не указано',
                from: exp.from || 'Не указано',
                to: exp.to || 'Не указано',
                place: exp.place || 'Не указано',
                link: exp.link || '',
                specialization: exp.specialization || 'Neatsoft',
                workTime: exp.workTime || '',
                imgName: exp.imgName || 'default-image.jpg', 
                images: exp.images || [],
                type: 'work',
                });
            await this.workExperienceRepository.save(experienceEntity);
        }

        // Сохраняем education experience
        for (const exp of educationExperience) {
        const educationEntity = this.educationRepository.create({
            logoPath: exp.logoPath || '',
            alt: exp.alt || '',
            iconPath: exp.iconPath || '',
            company: exp.company || 'Не указано',
            from: exp.from || 'Не указано',
            to: exp.to || 'Не указано',
            place: exp.place || 'Не указано',
            link: exp.link || '',
            specialization: exp.specialization || 'Computer Science',
            workTime: exp.workTime || '',
            imgName: exp.imgName || 'default-image.jpg', 
            images: exp.images || [],
            type: 'education',
        });
    await this.educationRepository.save(educationEntity);
}

        console.log(`Migrated ${workExperience.length + educationExperience.length} experience items`);
    } catch (error) {
        console.error('Experience migration failed:', error);
        throw error;
    }
}

    @ApiOperation({ 
        summary: 'Миграция боковой панели технологий', 
        description: 'Мигрирует данные боковой панели технологий из Firebase в PostgreSQL'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция боковой панели технологий успешно завершена'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции боковой панели технологий' 
    })
    async migrateTechnologiesAside(): Promise<void> {
        try {
            console.log('Migrating technologies aside...');
            const technologiesAside = await this.firebaseService.getTechnologiesAside();
            await this.technologiesAsideRepository.clear();

            for (const tech of technologiesAside) {
                const techEntity = this.technologiesAsideRepository.create({
                    title: tech.title,
                    value: tech.value,
                    imgName: tech.imgName || '',
                    images: tech.images || [],
                });
                await this.technologiesAsideRepository.save(techEntity);
            }
            console.log(`Migrated ${technologiesAside.length} technologies aside items`);
        } catch (error) {
            console.error('Technologies aside migration failed:', error);
            throw error;
        }
    }

    @ApiOperation({ 
        summary: 'Миграция боковой панели опыта', 
        description: 'Мигрирует данные боковой панели опыта из Firebase в PostgreSQL'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция боковой панели опыта успешно завершена'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции боковой панели опыта' 
    })
    async migrateExperienceAside(): Promise<void> {
        try {
            console.log('Migrating experience aside...');
            const experienceAside = await this.firebaseService.getExperienceAside();
            await this.experienceAsideRepository.clear();

            for (const exp of experienceAside) {
                const experienceEntity = this.experienceAsideRepository.create({
                    title: exp.title,
                    value: exp.value,
                    imgName: exp.imgName || '',
                    images: exp.images || [],
                });
                await this.experienceAsideRepository.save(experienceEntity);
            }
            console.log(`Migrated ${experienceAside.length} experience aside items`);
        } catch (error) {
            console.error('Experience aside migration failed:', error);
            throw error;
        }
    }

    @ApiOperation({ 
        summary: 'Миграция технологий', 
        description: 'Мигрирует данные технологий (backend, frontend, other) из Firebase в PostgreSQL'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция технологий успешно завершена'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции технологий' 
    })
    async migrateTechnologies(): Promise<void> {
        try {
            console.log('Migrating technologies...');

            const backendTech = await this.firebaseService.getBackendTechWithImages();
            const frontendTech = await this.firebaseService.getFrontendTechWithImages();
            const otherTech = await this.firebaseService.getOtherTechWithImages();

            await this.technologyRepository.clear();

            // Backend technologies
            for (const tech of backendTech) {
                const techEntity = this.technologyRepository.create({
                    alt: tech.alt,
                    iconPath: tech.iconPath,
                    link: tech.link,
                    technologyName: tech.technologyName,
                    imgName: tech.imgName,
                    images: tech.images || [],
                    category: 'backend',
                });
                await this.technologyRepository.save(techEntity);
            }

            // Frontend technologies
            for (const tech of frontendTech) {
                const techEntity = this.technologyRepository.create({
                    alt: tech.alt,
                    iconPath: tech.iconPath,
                    link: tech.link,
                    technologyName: tech.technologyName,
                    imgName: tech.imgName,
                    images: tech.images || [],
                    category: 'frontend',
                });
                await this.technologyRepository.save(techEntity);
            }

            // Other technologies
            for (const tech of otherTech) {
                const techEntity = this.technologyRepository.create({
                    alt: tech.alt,
                    iconPath: tech.iconPath,
                    link: tech.link,
                    technologyName: tech.technologyName,
                    imgName: tech.imgName,
                    images: tech.images || [],
                    category: 'other',
                });
                await this.technologyRepository.save(techEntity);
            }

            console.log(`Migrated ${backendTech.length + frontendTech.length + otherTech.length} technology items`);
        } catch (error) {
            console.error('Technologies migration failed:', error);
            throw error;
        }
    }

    @ApiOperation({ 
        summary: 'Миграция информации главной страницы', 
        description: 'Мигрирует данные главной страницы из Firebase в PostgreSQL'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция информации главной страницы успешно завершена'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции информации главной страницы' 
    })
    async migrateMainPageInfo(): Promise<void> {
        try {
            console.log('Migrating main page info...');
            const mainPageInfo = await this.firebaseService.getMainPageInfo();
            await this.mainPageInfoRepository.clear();

            for (const info of mainPageInfo) {
                const infoEntity = this.mainPageInfoRepository.create({
                    buttonHoverText: info.buttonHoverText || '',
                    buttonText: info.buttonText || '',
                    description: info.description,
                    name: info.name,
                    imgSrc: info.imgSrc,
                    stack: info.stack,
                    status: info.status,
                    imgName: info.imgName,
                    images: info.images || [],
                });
                await this.mainPageInfoRepository.save(infoEntity);
            }
            console.log(`Migrated ${mainPageInfo.length} main page info items`);
        } catch (error) {
            console.error('Main page info migration failed:', error);
            throw error;
        }
    }

    @ApiOperation({ 
        summary: 'Миграция тематических изображений', 
        description: 'Мигрирует тематические изображения из Firebase в PostgreSQL'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция тематических изображений успешно завершена'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции тематических изображений' 
    })
    async migrateThemelessPictures(): Promise<void> {
        try {
            console.log('Migrating themeless pictures...');
            const themelessPictures = await this.firebaseService.getThemelessPictures();
            await this.themelessPicturesRepository.clear();

            for (const picture of themelessPictures) {
                const pictureEntity = this.themelessPicturesRepository.create({
                    name: picture.name || '',
                    whiteModeIconPath: picture.whiteModeIconPath || '',
                    imgSrc: picture.imgSrc || '',
                    alt: picture.alt || '',
                    darkModeIconPath: picture.darkModeIconPath || '',
                });
                await this.themelessPicturesRepository.save(pictureEntity);
            }
            console.log(`Migrated ${themelessPictures.length} themeless pictures`);
        } catch (error) {
            console.error('Themeless pictures migration failed:', error);
            throw error;
        }
    }

    @ApiOperation({ 
        summary: 'Миграция проектов', 
        description: 'Мигрирует данные проектов из Firebase в PostgreSQL'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция проектов успешно завершена'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции проектов' 
    })
    async migrateProjects(): Promise<void> {
        try {
            console.log('Migrating projects...');
            const projects = await this.firebaseService.getProjectsAsideWithImages();
            await this.projectRepository.clear();
            
            for (const project of projects) {
                const projectEntity = this.projectRepository.create({
                    title: project.title,
                    description: project.description,
                    technologies: project.technologies || [],
                    githubUrl: project.githubUrl || '',
                    liveUrl: project.liveUrl || '',
                    images: project.images || [],
                    alt: project.alt || '',
                    category: project.category || '',
                    status: project.status || '',
                    startDate: project.startDate || '',
                    endDate: project.endDate || '',
                });
                await this.projectRepository.save(projectEntity);
            }
            console.log(`Migrated ${projects.length} projects`);
        } catch (error) {
            console.error('Projects migration failed:', error);
            throw error;
        }
    }

    @ApiOperation({ 
        summary: 'Миграция репозиториев', 
        description: 'Мигрирует данные репозиториев из Firebase в PostgreSQL'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция репозиториев успешно завершена'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции репозиториев' 
    })
    async migrateRepositories(): Promise<void> {
        try {
            console.log('Migrating repositories...');
            const repositories = await this.firebaseService.getRepositories();
            await this.repositoryRepository.clear();
            
            for (const repo of repositories) {
                const repoEntity = this.repositoryRepository.create({
                    name: repo.name,
                    description: repo.description,
                    url: repo.url,
                    language: repo.language || '',
                    stars: repo.stars || 0,
                    forks: repo.forks || 0,
                    updatedAt: repo.updatedAt || '',
                    topics: repo.topics || [],
                });
                await this.repositoryRepository.save(repoEntity);
            }
            console.log(`Migrated ${repositories.length} repositories`);
        } catch (error) {
            console.error('Repositories migration failed:', error);
            throw error;
        }
    }

    @ApiOperation({ 
        summary: 'Миграция персон', 
        description: 'Мигрирует данные персон из Firebase в PostgreSQL'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция персон успешно завершена'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции персон' 
    })
    async migratePersons(): Promise<void> {
        try {
            console.log('Migrating persons...');
            const persons = await this.firebaseService.getPersons();
            await this.personRepository.clear();
            
            for (const person of persons) {
                const personEntity = this.personRepository.create({
                    name: person.name,
                    position: person.position,
                    email: person.email,
                    phone: person.phone || '',
                    avatar: person.avatar || '',
                    bio: person.bio || '',
                    location: person.location || '',
                });
                await this.personRepository.save(personEntity);
            }
            console.log(`Migrated ${persons.length} persons`);
        } catch (error) {
            console.error('Persons migration failed:', error);
            throw error;
        }
    }

    @ApiOperation({ 
        summary: 'Миграция пользователей', 
        description: 'Мигрирует данные пользователей из Firebase в PostgreSQL'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Миграция пользователей успешно завершена'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Ошибка при миграции пользователей' 
    })
    async migrateUsers(): Promise<void> {
        try {
            console.log('Migrating users...');
            const users = await this.firebaseService.getUsers();
            await this.userRepository.clear();
            
            for (const user of users) {
                const userEntity = this.userRepository.create({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || '',
                    photoURL: user.photoURL || '',
                    createdAt: user.createdAt || '',
                    lastLoginAt: user.lastLoginAt || '',
                });
                await this.userRepository.save(userEntity);
            }
            console.log(`Migrated ${users.length} users`);
        } catch (error) {
            console.error('Users migration failed:', error);
            throw error;
        }
    }

    // Методы для получения данных из PostgreSQL с декораторами Swagger
    @ApiOperation({ summary: 'Получить мигрированные данные навигации' })
    @ApiResponse({ status: 200, description: 'Список навигации', type: [NavigationEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении данных навигации' })
    async getMigratedNavigation(): Promise<NavigationEntity[]> {
        return this.navigationRepository.find({ order: { position: 'ASC' } });
    }

    @ApiOperation({ summary: 'Получить мигрированные данные hard skills навигации' })
    @ApiResponse({ status: 200, description: 'Список hard skills навигации', type: [HardSkillsNavEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении данных hard skills навигации' })
    async getMigratedHardSkillsNav(): Promise<HardSkillsNavEntity[]> {
        return this.hardSkillsNavRepository.find();
    }

    @ApiOperation({ summary: 'Получить мигрированные данные социальных сетей' })
    @ApiResponse({ status: 200, description: 'Список социальных сетей', type: [SocialMediaEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении данных социальных сетей' })
    async getMigratedSocialMedia(): Promise<SocialMediaEntity[]> {
        return this.socialMediaRepository.find();
    }

    @ApiOperation({ summary: 'Получить мигрированные данные рабочего опыта' })
    @ApiResponse({ status: 200, description: 'Список рабочего опыта', type: [WorkExperienceEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении данных рабочего опыта' })
    async getMigratedWorkExperience(): Promise<WorkExperienceEntity[]> {
        return this.workExperienceRepository.find();
    }

    @ApiOperation({ summary: 'Получить мигрированные данные образовательного опыта' })
    @ApiResponse({ status: 200, description: 'Список образовательного опыта', type: [EducationExperienceEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении данных образовательного опыта' })
    async getMigratedEducationExperience(): Promise<EducationExperienceEntity[]> {
        return this.educationRepository.find();
    }

    @ApiOperation({ summary: 'Получить мигрированные данные технологий' })
    @ApiResponse({ status: 200, description: 'Список технологий', type: [TechnologyEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении данных технологий' })
    async getMigratedTechnologies(category?: string): Promise<TechnologyEntity[]> {
        const where = category ? { category } : {};
        return this.technologyRepository.find({ where });
    }

    @ApiOperation({ summary: 'Получить мигрированные данные боковой панели технологий' })
    @ApiResponse({ status: 200, description: 'Список боковой панели технологий', type: [TechnologiesAsideEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении данных боковой панели технологий' })
    async getMigratedTechnologiesAside(): Promise<TechnologiesAsideEntity[]> {
        return this.technologiesAsideRepository.find();
    }

    @ApiOperation({ summary: 'Получить мигрированные данные боковой панели опыта' })
    @ApiResponse({ status: 200, description: 'Список боковой панели опыта', type: [ExperienceAsideEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении данных боковой панели опыта' })
    async getMigratedExperienceAside(): Promise<ExperienceAsideEntity[]> {
        return this.experienceAsideRepository.find();
    }

    @ApiOperation({ summary: 'Получить мигрированные данные главной страницы' })
    @ApiResponse({ status: 200, description: 'Список информации главной страницы', type: [MainPageInfoEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении данных главной страницы' })
    async getMigratedMainPageInfo(): Promise<MainPageInfoEntity[]> {
        return this.mainPageInfoRepository.find();
    }

    @ApiOperation({ summary: 'Получить мигрированные тематические изображения' })
    @ApiResponse({ status: 200, description: 'Список тематических изображений', type: [ThemelessPicturesEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении тематических изображений' })
    async getMigratedThemelessPictures(): Promise<ThemelessPicturesEntity[]> {
        return this.themelessPicturesRepository.find();
    }

    @ApiOperation({ summary: 'Получить мигрированные данные проектов' })
    @ApiResponse({ status: 200, description: 'Список проектов', type: [ProjectEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении данных проектов' })
    async getMigratedProjects(): Promise<ProjectEntity[]> {
        return this.projectRepository.find();
    }

    @ApiOperation({ summary: 'Получить мигрированные данные репозиториев' })
    @ApiResponse({ status: 200, description: 'Список репозиториев', type: [RepositoryMigrationEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении данных репозиториев' })
    async getMigratedRepositories(): Promise<RepositoryMigrationEntity[]> {
        return this.repositoryRepository.find();
    }

    @ApiOperation({ summary: 'Получить мигрированные данные персон' })
    @ApiResponse({ status: 200, description: 'Список персон', type: [PersonEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении данных персон' })
    async getMigratedPersons(): Promise<PersonEntity[]> {
        return this.personRepository.find();
    }

    @ApiOperation({ summary: 'Получить мигрированные данные пользователей' })
    @ApiResponse({ status: 200, description: 'Список пользователей', type: [UserEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении данных пользователей' })
    async getMigratedUsers(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }
}