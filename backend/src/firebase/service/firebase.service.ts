import { Injectable } from '@nestjs/common';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../utils/firebase.config';
import * as admin from 'firebase-admin';
import { TNavigation } from 'src/models/navigation.type';

@Injectable()
export class FirebaseService {
  private bucket = admin.storage().bucket();

  public async getImagesByFolder(folder: string): Promise<string[]> {
    console.log(`Fetching images from folder: ${folder}`);
    const [files] = await this.bucket.getFiles({ prefix: folder });
    console.log(`Files found: ${files.length}`);
    const urls = await Promise.all(
      files.map(async (file) => {
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: '03-01-2500',
        });
        console.log(`Generated URL: ${url}`);
        return url;
      }),
    );
    return urls;
  }

  async getNavigation(): Promise<TNavigation[]> {
    const querySnapshot = await getDocs(collection(db, 'navigation'));
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        link: data.link,
        position: data.position,
        value: data.value,
        imgName: data.imgName,
      } as TNavigation;
    });
  }

  async getSocialMediaLinks(): Promise<any> {
    const querySnapshot = await getDocs(collection(db, 'socialMediaLinks'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getWorkExperience(): Promise<any> {
    const querySnapshot = await getDocs(collection(db, 'workExperience'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getHardSkillsNav(): Promise<any> {
    const querySnapshot = await getDocs(collection(db, 'hardSkillsNav'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getEducationPlaces(): Promise<any> {
    const querySnapshot = await getDocs(collection(db, 'educationExperience'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getMainPageInfo(): Promise<any> {
    const querySnapshot = await getDocs(collection(db, 'mainPageInfo'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getTechnologiesAside(): Promise<any> {
    const querySnapshot = await getDocs(collection(db, 'technologiesAside'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getExperienceAside(): Promise<any> {
    const querySnapshot = await getDocs(collection(db, 'experienceAside'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getBackendTech(): Promise<any> {
    const querySnapshot = await getDocs(collection(db, 'backendTech'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getThemelessPictures(): Promise<any> {
    const querySnapshot = await getDocs(collection(db, 'themelessPictures'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getOtherTech(): Promise<any> {
    const querySnapshot = await getDocs(collection(db, 'otherTech'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getFrontendTech(): Promise<any> {
    const querySnapshot = await getDocs(collection(db, 'frontendTech'));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getBackendTechWithImages(): Promise<any> {
    const backendTech = await this.getBackendTech();
    const images = await this.getImagesByFolder('technologies/backend');
    return backendTech.map((tech) => ({
      ...tech,
      iconPath: images.find((url) => url.includes(tech.alt)) || '',
    }));
  }

  async getOtherTechWithImages(): Promise<any> {
    const otherTech = await this.getOtherTech();
    const images = await this.getImagesByFolder('technologies/other');
    return otherTech.map((tech) => ({
      ...tech,
      iconPath: images.find((url) => url.includes(tech.alt)) || '',
    }));
  }

  async getFrontendTechWithImages(): Promise<any> {
    const frontendTech = await this.getFrontendTech();
    const images = await this.getImagesByFolder('technologies/frontend');
    return frontendTech.map(
      (tech) => (
        console.log(tech.alt),
        {
          ...tech,
          iconPath: images.find((url) => url.includes(tech.alt)) || '',
        }
      ),
    );
  }

  async getIconsWhiteMode(): Promise<any> {
    const frontendTech = await this.getFrontendTech();
    const images = await this.getImagesByFolder('icons/white-mode');
    return frontendTech.map((tech) => ({
      ...tech,
      iconPath: images.find((url) => url.includes(tech.alt)) || '',
    }));
  }

  async getIconsDarkMode(): Promise<any> {
    const frontendTech = await this.getFrontendTech();
    const images = await this.getImagesByFolder('icons/dark-mode');
    return frontendTech.map((tech) => ({
      ...tech,
      iconPath: images.find((url) => url.includes(tech.alt)) || '',
    }));
  }
}
