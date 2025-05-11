import { DocumentData } from 'firebase/firestore';
import { TNavigationDto } from 'src/models/navigation-dto.type';
import { TTechnologiesDto } from './technologies-dto.type';
import { TSocialMediaDto } from './social-media-dto.type';
import { TExperienceDto } from './experience-dto.type';

export interface FirebaseService {
  getImagesByFolder(folder: string): Promise<string[]>;
  getNavigation(): Promise<TNavigationDto[]>;
  getSocialMediaLinks(): Promise<TSocialMediaDto[]>;
  getWorkExperience(): Promise<TExperienceDto[]>;
  getHardSkillsNav(): Promise<DocumentData[]>;
  getEducationPlaces(): Promise<DocumentData[]>;
  getMainPageInfo(): Promise<DocumentData[]>;
  getTechnologiesAside(): Promise<DocumentData[]>;
  getProjectsAside(): Promise<DocumentData[]>;
  getExperienceAside(): Promise<DocumentData[]>;
  getBackendTech(): Promise<DocumentData[]>;
  getOtherTech(): Promise<DocumentData[]>;
  getFrontendTech(): Promise<DocumentData[]>;
  getBackendTechWithImages(): Promise<TTechnologiesDto[]>;
  getOtherTechWithImages(): Promise<TTechnologiesDto[]>;
  getFrontendTechWithImages(): Promise<TTechnologiesDto[]>;
}
