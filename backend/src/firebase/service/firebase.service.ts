import { getDocs, collection } from 'firebase/firestore';
import { db } from '../utils/firebase.config';
import * as admin from 'firebase-admin';
import { TNavigationDto } from 'src/models/navigation-dto.type';
import { TSocialMediaDto } from 'src/models/social-media-dto.type';
import { TExperienceDto } from 'src/models/experience-dto.type';
import { TTechnologiesDto } from 'src/models/technologies-dto.type';
import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class FirebaseService {
  private bucket = admin.storage().bucket();

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
      return querySnapshot.docs.map((doc) => doc.data() as T);
    } catch (error) {
      console.error(
        `Error getting data from collection ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  async getNavigation(): Promise<TNavigationDto[]> {
    return this.getCollectionData<TNavigationDto>('navigation');
  }

  async getSocialMediaLinks(): Promise<TSocialMediaDto[]> {
    return this.getCollectionData<TSocialMediaDto>('socialMediaLinks');
  }

  async getWorkExperience(): Promise<TExperienceDto[]> {
    return this.getCollectionData<TExperienceDto>('workExperience');
  }

  async getEducationPlaces(): Promise<TExperienceDto[]> {
    return this.getCollectionData<TExperienceDto>('educationExperience');
  }

  async getEducationPlacesWithImages(): Promise<TExperienceDto[]> {
    const educationPlaces = await this.getEducationPlaces();
    const images = await this.getImagesByFolder('certificates');
    return educationPlaces.map((place) => ({
      ...place,
      iconPath: images.find((url) => url.includes(place.alt)) || '',
    }));
  }

  async getWorkExperienceWithImages(): Promise<TExperienceDto[]> {
    const workExperience = await this.getWorkExperience();
    const images = await this.getImagesByFolder('companies-logo');
    return workExperience.map((experience) => ({
      ...experience,
      iconPath: images.find((url) => url.includes(experience.alt)) || '',
    }));
  }

  async getHardSkillsNav(): Promise<TNavigationDto[]> {
    return this.getCollectionData<TNavigationDto>('hardSkillsNav');
  }

  async getMainPageInfo(): Promise<TTechnologiesDto[]> {
    return this.getCollectionData<TTechnologiesDto>('mainPageInfo');
  }

  async getTechnologiesAside(): Promise<TTechnologiesDto[]> {
    return this.getCollectionData<TTechnologiesDto>('technologiesAside');
  }

  async getExperienceAside(): Promise<TExperienceDto[]> {
    return this.getCollectionData<TExperienceDto>('experienceAside');
  }

  async getBackendTech(): Promise<TTechnologiesDto[]> {
    return this.getCollectionData<TTechnologiesDto>('backendTech');
  }

  async getThemelessPictures(): Promise<TTechnologiesDto[]> {
    return this.getCollectionData<TTechnologiesDto>('themelessPictures');
  }

  async getOtherTech(): Promise<TTechnologiesDto[]> {
    return this.getCollectionData<TTechnologiesDto>('otherTech');
  }

  async getFrontendTech(): Promise<TTechnologiesDto[]> {
    return this.getCollectionData<TTechnologiesDto>('frontendTech');
  }

  async getBackendTechWithImages(): Promise<TTechnologiesDto[]> {
    const backendTech = await this.getBackendTech();
    const images = await this.getImagesByFolder('technologies/backend');
    return backendTech.map((tech) => ({
      ...tech,
      iconPath: images.find((url) => url.includes(tech.alt)) || '',
    }));
  }

  async getOtherTechWithImages(): Promise<TTechnologiesDto[]> {
    const otherTech = await this.getOtherTech();
    const images = await this.getImagesByFolder('technologies/other');
    return otherTech.map((tech) => ({
      ...tech,
      iconPath: images.find((url) => url.includes(tech.alt)) || '',
    }));
  }

  async getFrontendTechWithImages(): Promise<TTechnologiesDto[]> {
    const frontendTech = await this.getFrontendTech();
    const images = await this.getImagesByFolder('technologies/frontend');
    return frontendTech.map((tech) => ({
      ...tech,
      iconPath: images.find((url) => url.includes(tech.alt)) || '',
    }));
  }
}
