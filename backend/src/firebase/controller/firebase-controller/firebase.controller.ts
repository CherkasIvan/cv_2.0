import { Controller, Get, Param } from '@nestjs/common';
import { FirebaseService } from '../../service/firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Get('images/:folder*')
  async getImagesByFolder(@Param('folder') folder: string) {
    console.log(`Request to get images from folder: ${folder}`);
    const images = await this.firebaseService.getImagesByFolder(folder);
    console.log(`Images fetched: ${images.length}`);
    return images;
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

  @Get('work-experience')
  async getWorkExperience() {
    const workExperience = await this.firebaseService.getWorkExperience();
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

  @Get('wm-pictures')
  async getIconsWhiteMode() {
    const themelessPictures = await this.firebaseService.getIconsWhiteMode();
    return themelessPictures;
  }

  @Get('dm-pictures')
  async getIconsDarkMode() {
    const themelessPictures = await this.firebaseService.getIconsDarkMode();
    return themelessPictures;
  }
}
