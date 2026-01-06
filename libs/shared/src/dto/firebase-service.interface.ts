import { DocumentData } from 'firebase/firestore';

import { TExperienceDto } from './experience-dto.type';
import { TNavigationDto } from './navigation-dto.type';
import { TSocialMediaDto } from './social-media-dto.type';
import { TTechnologiesDto } from './technologies-dto.type';

export interface FirebaseService {
    getImagesByFolder(folder: string): Promise<string[]>;
    getNavigation(): Promise<TNavigationDto[]>;
    getSocialMediaLinks(): Promise<TSocialMediaDto[]>;
    getWorkExperience(): Promise<TExperienceDto[]>;
    getHardSkillsNav(): Promise<DocumentData[]>;
    getEducationPlaces(): Promise<DocumentData[]>;
    getMainPageInfo(): Promise<DocumentData[]>;
    getTechnologiesAside(): Promise<DocumentData[]>;
    getExperienceAside(): Promise<DocumentData[]>;
    getBackendTech(): Promise<DocumentData[]>;
    getOtherTech(): Promise<DocumentData[]>;
    getFrontendTech(): Promise<DocumentData[]>;
    getBackendTechWithImages(): Promise<TTechnologiesDto[]>;
    getOtherTechWithImages(): Promise<TTechnologiesDto[]>;
    getFrontendTechWithImages(): Promise<TTechnologiesDto[]>;
}
