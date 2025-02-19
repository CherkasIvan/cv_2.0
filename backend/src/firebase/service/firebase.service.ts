import { Injectable } from '@nestjs/common';
import { getDocs, collection, DocumentData } from 'firebase/firestore';
import { db } from '../utils/firebase.config';
import * as admin from 'firebase-admin';
import { TNavigationDto } from 'src/models/navigation-dto.type';

@Injectable()
export class FirebaseService {
  private bucket = admin.storage().bucket();

  public async getImagesByFolder(folder: string): Promise<string[]> {
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
  }

  async getNavigation(): Promise<TNavigationDto[]> {
    const querySnapshot = await getDocs(collection(db, 'navigation'));
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        link: data.link,
        position: data.position,
        value: data.value,
        imgName: data.imgName,
      } as TNavigationDto;
    });
  }

  async getSocialMediaLinks(): Promise<DocumentData> {
    const querySnapshot = await getDocs(collection(db, 'socialMediaLinks'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getWorkExperience(): Promise<DocumentData> {
    const querySnapshot = await getDocs(collection(db, 'workExperience'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getHardSkillsNav(): Promise<DocumentData> {
    const querySnapshot = await getDocs(collection(db, 'hardSkillsNav'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getEducationPlaces(): Promise<DocumentData> {
    const querySnapshot = await getDocs(collection(db, 'educationExperience'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getMainPageInfo(): Promise<DocumentData> {
    const querySnapshot = await getDocs(collection(db, 'mainPageInfo'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getTechnologiesAside(): Promise<DocumentData> {
    const querySnapshot = await getDocs(collection(db, 'technologiesAside'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getExperienceAside(): Promise<DocumentData> {
    const querySnapshot = await getDocs(collection(db, 'experienceAside'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getBackendTech(): Promise<DocumentData> {
    const querySnapshot = await getDocs(collection(db, 'backendTech'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getThemelessPictures(): Promise<DocumentData> {
    const querySnapshot = await getDocs(collection(db, 'themelessPictures'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getOtherTech(): Promise<DocumentData> {
    const querySnapshot = await getDocs(collection(db, 'otherTech'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getFrontendTech(): Promise<DocumentData> {
    const querySnapshot = await getDocs(collection(db, 'frontendTech'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getBackendTechWithImages(): Promise<DocumentData> {
    const backendTech = await this.getBackendTech();
    const images = await this.getImagesByFolder('technologies/backend');
    return backendTech.map((tech) => ({
      ...tech,
      iconPath: images.find((url) => url.includes(tech.alt)) || '',
    }));
  }

  async getOtherTechWithImages(): Promise<DocumentData> {
    const otherTech = await this.getOtherTech();
    const images = await this.getImagesByFolder('technologies/other');
    return otherTech.map((tech) => ({
      ...tech,
      iconPath: images.find((url) => url.includes(tech.alt)) || '',
    }));
  }

  async getFrontendTechWithImages(): Promise<DocumentData> {
    const frontendTech = await this.getFrontendTech();
    const images = await this.getImagesByFolder('technologies/frontend');
    return frontendTech.map((tech) => ({
      ...tech,
      iconPath: images.find((url) => url.includes(tech.alt)) || '',
    }));
  }

  async getIconsWhiteMode(): Promise<DocumentData> {
    const frontendTech = await this.getFrontendTech();
    const images = await this.getImagesByFolder('icons/white-mode');
    return frontendTech.map((tech) => ({
      ...tech,
      iconPath: images.find((url) => url.includes(tech.alt)) || '',
    }));
  }

  async getIconsDarkMode(): Promise<DocumentData> {
    const frontendTech = await this.getFrontendTech();
    const images = await this.getImagesByFolder('icons/dark-mode');
    return frontendTech.map((tech) => ({
      ...tech,
      iconPath: images.find((url) => url.includes(tech.alt)) || '',
    }));
  }
}
