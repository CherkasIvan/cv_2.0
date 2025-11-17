import { DocumentData } from 'firebase/firestore';
import { NavigationClassDto } from './navigation-class.dto';
import { SocialMediaClassDto } from './social-media-class.dto';
import { TechnologiesClassDto } from './technologies-class.dto';
import { EducationExperienceClassDto } from './education-experience-class.dto';


export type FirebaseService = {
    getImagesByFolder(folder: string): Promise<string[]>;
    getNavigation(): Promise<NavigationClassDto[]>;
    getSocialMediaLinks(): Promise<SocialMediaClassDto[]>;
    getWorkExperience(): Promise<EducationExperienceClassDto[]>;
    getHardSkillsNav(): Promise<DocumentData[]>;
    getEducationPlaces(): Promise<DocumentData[]>;
    getMainPageInfo(): Promise<DocumentData[]>;
    getTechnologiesAside(): Promise<DocumentData[]>;
    getExperienceAside(): Promise<DocumentData[]>;
    getBackendTech(): Promise<DocumentData[]>;
    getOtherTech(): Promise<DocumentData[]>;
    getFrontendTech(): Promise<DocumentData[]>;
    getBackendTechWithImages(): Promise<TechnologiesClassDto[]>;
    getOtherTechWithImages(): Promise<TechnologiesClassDto[]>;
    getFrontendTechWithImages(): Promise<TechnologiesClassDto[]>;
}
