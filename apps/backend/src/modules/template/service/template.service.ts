import { Repository } from 'typeorm';

import { ExperienceAsideEntity } from '@shared/entities/experience-aside.entity';
import { HardSkillsNavEntity } from '@shared/entities/hard-skills-nav.entity';
import { MainPageInfoEntity } from '@shared/entities/main-page-info.entity';
import { NavigationEntity } from '@shared/entities/navigation.entity';
import { SocialMediaEntity } from '@shared/entities/social-media.entity';
import { TechnologiesAsideEntity } from '@shared/entities/technologies-aside.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TemplateService {
    constructor(
        @InjectRepository(MainPageInfoEntity)
        private readonly mainPageInfoRepository: Repository<MainPageInfoEntity>,

        @InjectRepository(NavigationEntity)
        private readonly navigationRepository: Repository<NavigationEntity>,

        @InjectRepository(SocialMediaEntity)
        private readonly socialMediaRepository: Repository<SocialMediaEntity>,

        @InjectRepository(ExperienceAsideEntity)
        private readonly experienceAsideRepository: Repository<ExperienceAsideEntity>,

        @InjectRepository(TechnologiesAsideEntity)
        private readonly technologiesAsideRepository: Repository<TechnologiesAsideEntity>,

        @InjectRepository(HardSkillsNavEntity)
        private readonly hardSkillsNavRepository: Repository<HardSkillsNavEntity>,
    ) {}

    async getMainPageInfo(): Promise<MainPageInfoEntity[]> {
        return this.mainPageInfoRepository.find({
            order: {
                id: 'ASC',
            },
        });
    }

    async getNavigation(): Promise<NavigationEntity[]> {
        return this.navigationRepository.find({
            order: {
                position: 'ASC',
            },
        });
    }

    async getSocialMedia(): Promise<SocialMediaEntity[]> {
        return this.socialMediaRepository.find({
            order: {
                position: 'ASC',
            },
        });
    }

    async getExperienceAside(): Promise<ExperienceAsideEntity[]> {
        return this.experienceAsideRepository.find({
            order: {
                id: 'ASC',
            },
        });
    }

    async getTechnologiesAside(): Promise<TechnologiesAsideEntity[]> {
        return this.technologiesAsideRepository.find({
            relations: ['hardSkills'],
            order: {
                id: 'ASC',
            },
        });
    }

    async getHardSkillsNav(): Promise<HardSkillsNavEntity[]> {
        return this.hardSkillsNavRepository.find({
            relations: ['technologyAside'],
            order: {
                id: 'ASC',
            },
        });
    }

    async getHardSkillsByTechnologyId(
        technologyId: number,
    ): Promise<HardSkillsNavEntity[]> {
        return this.hardSkillsNavRepository.find({
            where: {
                technology_aside_id: technologyId,
            },
            order: {
                id: 'ASC',
            },
        });
    }

    async getTemplateData(templateName: string): Promise<any> {
        switch (templateName) {
            case 'main-page-info':
                return this.getMainPageInfo();
            case 'navigation':
                return this.getNavigation();
            case 'social-media':
                return this.getSocialMedia();
            case 'experience-aside':
                return this.getExperienceAside();
            case 'technologies-aside':
                return this.getTechnologiesAside();
            case 'hard-skills-nav':
                return this.getHardSkillsNav();
            default:
                return null;
        }
    }
}
