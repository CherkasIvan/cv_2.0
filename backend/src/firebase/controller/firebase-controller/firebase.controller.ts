import { Controller, Get, Param } from '@nestjs/common';
import { FirebaseService } from '../../service/firebase.service';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Get('images/:folder')
  getImages(@Param('folder') folder: string): Observable<string[]> {
    return from(this.firebaseService.getImagesByFolder(folder)).pipe(
      map((urls: string[]) => urls),
    );
  }

  @Get('navigation')
  async getNavigation() {
    const navigation = await this.firebaseService.getNavigation();
    return navigation;
  }

  @Get('social-media-links')
  async getSocialMediaLinks() {
    const socialMediaLinks = await this.firebaseService.getSocialMediaLinks();
    return socialMediaLinks;
  }

  @Get('experience-aside')
  async getExperienceAside() {
    const experienceAside = await this.firebaseService.getExperienceAside();
    return experienceAside;
  }

  @Get('education-places')
  async getEducationPlacesWithImages() {
    const educationPlaces =
      await this.firebaseService.getEducationPlacesWithImages();
    return educationPlaces;
  }

  @Get('work-experience')
  async getWorkExperienceWithImages() {
    const workExperience =
      await this.firebaseService.getWorkExperienceWithImages();
    return workExperience;
  }

  @Get('backend')
  async getBackendTech() {
    const backendTech = await this.firebaseService.getBackendTechWithImages();
    return backendTech;
  }

  @Get('other')
  async getOtherTech() {
    const otherTech = await this.firebaseService.getOtherTechWithImages();
    return otherTech;
  }

  @Get('frontend')
  async getFrontendTech() {
    const frontendTech = await this.firebaseService.getFrontendTechWithImages();
    return frontendTech;
  }

  @Get('hard-skills-nav')
  async getHardSkillsNav() {
    const hardSkillsNav = await this.firebaseService.getHardSkillsNav();
    return hardSkillsNav;
  }

  @Get('main-page-info')
  async getMainPageInfo() {
    const mainPageInfo = await this.firebaseService.getMainPageInfo();
    return mainPageInfo;
  }

  @Get('technologies-aside')
  async getTechnologiesAside() {
    const technologiesAside = await this.firebaseService.getTechnologiesAside();
    return technologiesAside;
  }
}
