import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { TExperienceAside } from '@core/models/experience-aside.type';
import { IMainPageInfo } from '@core/models/main-page-info';
import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { ITechnologies } from '@core/models/technologies.interface';
import { IWorkExperience } from '@core/models/work-experience.interface';

import { IEducationExperience } from '@app/core/models/education.interface';

export const FirebaseActions = createActionGroup({
    source: 'Firebase API',
    events: {
        getNavigation: props<{ imgName: string }>(),
        getNavigationSuccess: props<{
            navigation: INavigation[];
            images?: string[];
        }>(),
        getNavigationError: props<{ error: unknown }>(),

        getSocialMedia: props<{ imgName: string }>(),
        getSocialMediaSuccess: props<{
            socialMediaLinks: ISocialMedia[];
            images?: string[];
        }>(),
        getSocialMediaError: props<{ error: unknown }>(),

        getWorkExperience: props<{ imgName: string }>(),
        getWorkExperienceSuccess: props<{
            workExperience: IWorkExperience[];
            images?: string[];
        }>(),
        getWorkExperienceError: props<{ error: unknown }>(),

        getFrontendTech: props<{ imgName: string }>(),
        getFrontendTechSuccess: props<{
            frontendTech: ITechnologies[];
            images?: string[];
        }>(),
        getFrontendTechError: props<{ error: unknown }>(),

        getBackendTech: props<{ imgName: string }>(),
        getBackendTechSuccess: props<{
            backendTech: ITechnologies[];
            images?: string[];
        }>(),
        getBackendTechError: props<{ error: unknown }>(),

        getOtherTech: props<{ imgName: string }>(),
        getOtherTechSuccess: props<{
            otherTech: ITechnologies[];
            images?: string[];
        }>(),
        getOtherTechError: props<{ error: unknown }>(),

        getHardSkillsNav: props<{ imgName: string }>(),
        getHardSkillsNavSuccess: props<{
            hardSkillsNav: INavigation[];
            images?: string[];
        }>(),
        getHardSkillsNavError: props<{ error: unknown }>(),

        getEducationPlaces: props<{ imgName: string }>(),
        getEducationPlacesSuccess: props<{
            education: IEducationExperience[];
            images?: string[];
        }>(),
        getEducationPlacesError: props<{ error: unknown }>(),

        getMainPageInfo: props<{ imgName: string }>(),
        getMainPageInfoSuccess: props<{
            mainPageInfo: IMainPageInfo;
            images?: string[];
        }>(),
        getMainPageInfoError: props<{ error: unknown }>(),

        getExperienceAside: props<{ imgName: string }>(),
        getExperienceAsideSuccess: props<{
            experienceAside: TExperienceAside[];
            images?: string[];
        }>(),
        getExperienceAsideError: props<{ error: unknown }>(),

        getTechnologiesAside: props<{ imgName: string }>(),
        getTechnologiesAsideSuccess: props<{
            technologiesAside: TTechnologiesAside[];
            images?: string[];
        }>(),
        getTechnologiesAsideError: props<{ error: unknown }>(),
    },
});
