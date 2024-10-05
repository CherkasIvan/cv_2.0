import { Injectable } from '@nestjs/common';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../utils/firebase.config';
import * as admin from 'firebase-admin';
import { TNavigation } from 'src/models/navigation.type';

@Injectable()
export class FirebaseService {
  private bucket = admin.storage().bucket();

  async getImagesByFolder(folder: string): Promise<string[]> {
    const [files] = await this.bucket.getFiles({ prefix: folder });
    const base64Images = await Promise.all(
      files.map(async (file) => {
        const [buffer] = await file.download();
        return buffer.toString('base64');
      }),
    );
    return base64Images;
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

  async getBackendTech(): Promise<any> {
    const querySnapshot = await getDocs(collection(db, 'backendTech'));
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
}
