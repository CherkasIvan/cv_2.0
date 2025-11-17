import { createActionGroup, props } from '@ngrx/store';

import { TExperienceAside } from '@core/models/experience-aside.type';
import { TNavigation } from '@core/models/navigation.type';
import { TSocialMedia } from '@core/models/social-media.type';
import { TWorkExperience } from '@core/models/work-experience.type';
import { TFrontendTechnologies } from '@core/models/frontend-technologies.type';
import { TBackendTechnologies } from '@core/models/backend-technologies.type';
import { TOtherTechnologies } from '@core/models/other-technologies.type';
import { TMainPageInfo } from '@core/models/main-page-info';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { THardSkillsNav } from '@core/models/hard-skills-nav.type';
import { TEducationExperience } from '@core/models/education-experience.type';


export const FirebaseActions = createActionGroup({
    source: 'Firebase API',
    events: {
        getNavigation: props<{ imgName: string }>(),
        getNavigationSuccess: props<{
            navigation: TNavigation[];
            images?: string[];
        }>(),
        getNavigationError: props<{ error: Error | null }>(),

        getSocialMedia: props<{ imgName: string }>(),
        getSocialMediaSuccess: props<{
            socialMediaLinks: TSocialMedia[];
            images?: string[];
        }>(),
        getSocialMediaError: props<{ error: Error | null }>(),

        getWorkExperience: props<{ imgName: string }>(),
        getWorkExperienceSuccess: props<{
            workExperience: TWorkExperience[];
            images?: string[];
        }>(),
        getWorkExperienceError: props<{ error: Error | null }>(),

        getFrontendTech: props<{ imgName: string }>(),
        getFrontendTechSuccess: props<{
            frontendTech: TFrontendTechnologies[];
            images?: string[];
        }>(),
        getFrontendTechError: props<{ error: Error | null }>(),

        getBackendTech: props<{ imgName: string }>(),
        getBackendTechSuccess: props<{
            backendTech: TBackendTechnologies[];
            images?: string[];
        }>(),
        getBackendTechError: props<{ error: Error | null }>(),

        getOtherTech: props<{ imgName: string }>(),
        getOtherTechSuccess: props<{
            otherTech: TOtherTechnologies[];
            images?: string[];
        }>(),
        getOtherTechError: props<{ error: Error | null }>(),

        getHardSkillsNav: props<{ imgName: string }>(),
        getHardSkillsNavSuccess: props<{
            hardSkillsNav: THardSkillsNav[];
            images?: string[];
        }>(),
        getHardSkillsNavError: props<{ error: Error | null }>(),

        getEducationPlaces: props<{ imgName: string }>(),
        getEducationPlacesSuccess: props<{
            education: TEducationExperience[] | TWorkExperience[];
            images?: string[];
        }>(),
        getEducationPlacesError: props<{ error: Error | null }>(),

        getMainPageInfo: props<{ imgName: string }>(),
        getMainPageInfoSuccess: props<{
            mainPageInfo: TMainPageInfo;
            images?: string[];
        }>(),
        getMainPageInfoError: props<{ error: Error | null }>(),

        getExperienceAside: props<{ imgName: string }>(),
        getExperienceAsideSuccess: props<{
            experienceAside: TExperienceAside[];
            images?: string[];
        }>(),
        getExperienceAsideError: props<{ error: Error | null }>(),

        getTechnologiesAside: props<{ imgName: string | null }>(),
        getTechnologiesAsideSuccess: props<{
            technologiesAside: TTechnologiesAside[];
            images?: string[];
        }>(),
        getTechnologiesAsideError: props<{ error: Error | null }>(),

        getClose: props<{ imgName: string }>(),
        getCloseSuccess: props<{
            close: any;
            images?: string[];
        }>(),
        getCloseError: props<{ error: Error | null }>(),
    },
});
