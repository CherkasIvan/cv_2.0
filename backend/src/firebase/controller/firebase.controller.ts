import { Controller, Get, Param } from '@nestjs/common';
import { FirebaseService } from '../service/firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  // @Get('images')
  // async getImages() {
  // return await this.firebaseService.getImages();
  // }

  // @Get('files/:numberItems')
  // async getFiles(@Param('numberItems') numberItems: number) {
  // return await this.firebaseService.getFiles(numberItems);
  // }

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

  @Get('work-experience')
  async getWorkExperience() {
    const workExperience = await this.firebaseService.getWorkExperience();
    return workExperience;
  }

  @Get('backend-tech')
  async getBackendTech() {
    const backendTech = await this.firebaseService.getBackendTech();
    return backendTech;
  }

  @Get('other-tech')
  async getOtherTech() {
    const otherTech = await this.firebaseService.getOtherTech();
    return otherTech;
  }

  @Get('frontend-tech')
  async getFrontendTech() {
    const frontendTech = await this.firebaseService.getFrontendTech();
    return frontendTech;
  }

  @Get('hard-skills-nav')
  async getHardSkillsNav() {
    const hardkillsNav = await this.firebaseService.getHardSkillsNav();
    return hardkillsNav;
  }

  @Get('education-places')
  async getEducationPlaces() {
    const educationPlaces = await this.firebaseService.getEducationPlaces();
    return educationPlaces;
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

  @Get('experience-aside')
  async getExperienceAside() {
    const experienceAside = await this.firebaseService.getExperienceAside();
    return experienceAside;
  }
}
