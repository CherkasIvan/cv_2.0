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
        getNavigation: emptyProps(),
        getNavigationSuccess: props<{ navigation: INavigation[] }>(),
        getNavigationError: props<{ error: unknown }>(),

        getSocialMedia: emptyProps(),
        getSocialMediaSuccess: props<{
            socialMediaLinks: ISocialMedia[];
        }>(),
        getSocialMediaError: props<{ error: unknown }>(),

        getWorkExperience: emptyProps(),
        getWorkExperienceSuccess: props<{
            workExperience: IWorkExperience[];
        }>(),
        getWorkExperienceError: props<{ error: unknown }>(),

        getFrontendTech: emptyProps(),
        getFrontendTechSuccess: props<{ frontendTech: ITechnologies[] }>(),
        getFrontendTechError: props<{ error: unknown }>(),

        getBackendTech: emptyProps(),
        getBackendTechSuccess: props<{ backendTech: ITechnologies[] }>(),
        getBackendTechError: props<{ error: unknown }>(),

        getOtherTech: emptyProps(),
        getOtherTechSuccess: props<{ otherTech: ITechnologies[] }>(),
        getOtherTechError: props<{ error: unknown }>(),

        getHardSkillsNav: emptyProps(),
        getHardSkillsNavSuccess: props<{
            hardSkillsNav: INavigation[];
        }>(),
        getHardSkillsNavError: props<{ error: unknown }>(),

        getEducationPlaces: emptyProps(),
        getEducationPlacesSuccess: props<{
            education: IEducationExperience[];
        }>(),
        getEducationPlacesError: props<{ error: unknown }>(),

        getMainPageInfo: emptyProps(),
        getMainPageInfoSuccess: props<{ mainPageInfo: IMainPageInfo }>(),
        getMainPageInfoError: props<{ error: unknown }>(),

        getExperienceAside: emptyProps(),
        getExperienceAsideSuccess: props<{
            experienceAside: TExperienceAside[];
        }>(),
        getExperienceAsideError: props<{ error: unknown }>(),

        getTechnologiesAside: emptyProps(),
        getTechnologiesAsideSuccess: props<{
            technologiesAside: TTechnologiesAside[];
        }>(),
        getTechnologiesAsideError: props<{ error: unknown }>(),
    },
});
