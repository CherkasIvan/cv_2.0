import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { IEducation } from '@core/models/education.interface';
import { TExperienceAside } from '@core/models/experience-aside.type';
import { IMainPageInfo } from '@core/models/main-page-info';
import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { ITechnologies } from '@core/models/technologies.interface';
import { IWorkExperience } from '@core/models/work-experience.interface';

export const FirebaseActions = createActionGroup({
    source: 'Firebase API',
    events: {
        getNavigation: emptyProps(),
        getNavigationSuccess: props<{ navigation: INavigation[] }>(),
        getNavigationError: props<{ error: any }>(),

        getSocialMedia: emptyProps(),
        getSocialMediaSuccess: props<{
            socialMediaLinks: ISocialMedia[];
        }>(),
        getSocialMediaError: props<{ error: any }>(),

        getWorkExperience: emptyProps(),
        getWorkExperienceSuccess: props<{
            workExperience: IWorkExperience[];
        }>(),
        getWorkExperienceError: props<{ error: any }>(),

        getFrontendTech: emptyProps(),
        getFrontendTechSuccess: props<{ frontendTech: ITechnologies[] }>(),
        getFrontendTechError: props<{ error: any }>(),

        getBackendTech: emptyProps(),
        getBackendTechSuccess: props<{ backendTech: ITechnologies[] }>(),
        getBackendTechError: props<{ error: any }>(),

        getOtherTech: emptyProps(),
        getOtherTechSuccess: props<{ otherTech: ITechnologies[] }>(),
        getOtherTechError: props<{ error: any }>(),

        getHardSkillsNav: emptyProps(),
        getHardSkillsNavSuccess: props<{
            hardSkillsNav: INavigation[];
        }>(),
        getHardSkillsNavError: props<{ error: any }>(),

        getEducationPlaces: emptyProps(),
        getEducationPlacesSuccess: props<{ education: IEducation[] }>(),
        getEducationPlacesError: props<{ error: any }>(),

        getMainPageInfo: emptyProps(),
        getMainPageInfoSuccess: props<{ mainPageInfo: IMainPageInfo }>(),
        getMainPageInfoError: props<{ error: any }>(),

        getExperienceAside: emptyProps(),
        getExperienceAsideSuccess: props<{
            experienceAside: TExperienceAside[];
        }>(),
        getExperienceAsideError: props<{ error: any }>(),

        getTechnologiesAside: emptyProps(),
        getTechnologiesAsideSuccess: props<{
            technologiesAside: TTechnologiesAside[];
        }>(),
        getTechnologiesAsideError: props<{ error: any }>(),
    },
});
