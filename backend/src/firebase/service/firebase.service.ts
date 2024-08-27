import { Injectable } from '@nestjs/common';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../utils/firebase.config';

@Injectable()
export class FirebaseService {
  //   async getImages(): Promise<any> {
  //     const querySnapshot = await getDocs(collection(db, 'путь/к/изображениям'));
  //     return querySnapshot.docs.map((doc) => doc.data());
  //   }

  //   async getFiles(numberItems: number): Promise<any> {
  //     const querySnapshot = await getDocs(
  //       collection(db, 'your-collection-name').limit(numberItems),
  //     );
  //     return querySnapshot.docs.map((doc) => doc.data());
  //   }

  async getNavigation(): Promise<any> {
    const querySnapshot = await getDocs(collection(db, 'navigation'));
    return querySnapshot.docs.map((doc) => doc.data());
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
