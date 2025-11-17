import { createReducer, on } from '@ngrx/store';

import { FirebaseActions } from './firebase.actions';
import { TNavigation } from '@core/models/navigation.type';
import { TSocialMedia } from '@core/models/social-media.type';
import { TWorkExperience } from '@core/models/work-experience.type';
import { TFrontendTechnologies } from '@core/models/frontend-technologies.type';
import { TBackendTechnologies } from '@core/models/backend-technologies.type';
import { TOtherTechnologies } from '@core/models/other-technologies.type';
import { TMainPageInfo } from '@core/models/main-page-info';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { TExperienceAside } from '@core/models/experience-aside.type';
import { THardSkillsNav } from '@core/models/hard-skills-nav.type';
import { TEducationExperience } from '@core/models/education-experience.type';

export interface FirebaseState {
    navigation: TNavigation[];
    socialMediaLinks: TSocialMedia[];
    workExperience: TWorkExperience[];
    frontendTech: TFrontendTechnologies[];
    backendTech: TBackendTechnologies[];
    otherTech: TOtherTechnologies[];
    hardSkillsNav: THardSkillsNav[];
    education: TWorkExperience[] | TEducationExperience[];
    mainPageInfo: TMainPageInfo | null;
    experienceAside: TExperienceAside[];
    technologiesAside: TTechnologiesAside[];
    error: Error | null;
}

export const initialFirebaseState: FirebaseState = {
    navigation: [],
    socialMediaLinks: [],
    workExperience: [],
    frontendTech: [],
    backendTech: [],
    otherTech: [],
    hardSkillsNav: [],
    education: [],
    mainPageInfo: null,
    experienceAside: [],
    technologiesAside: [],
    error: null,
};

export const firebaseReducer = createReducer(
    initialFirebaseState,
    on(
        FirebaseActions.getNavigationSuccess,
        (
            state: FirebaseState,
            { navigation }: { navigation: TNavigation[] },
        ) => ({
            ...state,
            navigation,
            error: null,
        }),
    ),
    on(
        FirebaseActions.getNavigationError,
        (state: FirebaseState, { error }: { error: Error | null }) => ({
            ...state,
            error,
        }),
    ),
    on(
        FirebaseActions.getSocialMediaSuccess,
        (
            state: FirebaseState,
            { socialMediaLinks }: { socialMediaLinks: TSocialMedia[] },
        ) => ({
            ...state,
            socialMediaLinks,
            error: null,
        }),
    ),
    on(
        FirebaseActions.getSocialMediaError,
        (state: FirebaseState, { error }: { error: Error | null }) => ({
            ...state,
            error,
        }),
    ),
    on(
        FirebaseActions.getWorkExperienceSuccess,
        (
            state: FirebaseState,
            { workExperience }: { workExperience: TWorkExperience[] },
        ) => ({
            ...state,
            workExperience,
            error: null,
        }),
    ),
    on(
        FirebaseActions.getWorkExperienceError,
        (state: FirebaseState, { error }: { error: Error | null }) => ({
            ...state,
            error,
        }),
    ),
    on(
        FirebaseActions.getFrontendTechSuccess,
        (
            state: FirebaseState,
            { frontendTech }: { frontendTech: TFrontendTechnologies[] },
        ) => ({
            ...state,
            frontendTech,
            error: null,
        }),
    ),
    on(
        FirebaseActions.getFrontendTechError,
        (state: FirebaseState, { error }: { error: Error | null }) => ({
            ...state,
            error,
        }),
    ),
    on(
        FirebaseActions.getBackendTechSuccess,
        (
            state: FirebaseState,
            { backendTech }: { backendTech: TBackendTechnologies[] },
        ) => ({
            ...state,
            backendTech,
            error: null,
        }),
    ),
    on(
        FirebaseActions.getBackendTechError,
        (state: FirebaseState, { error }: { error: Error | null }) => ({
            ...state,
            error,
        }),
    ),
    on(
        FirebaseActions.getOtherTechSuccess,
        (
            state: FirebaseState,
            { otherTech }: { otherTech: TOtherTechnologies[] },
        ) => ({
            ...state,
            otherTech,
            error: null,
        }),
    ),
    on(
        FirebaseActions.getOtherTechError,
        (state: FirebaseState, { error }: { error: Error | null }) => ({
            ...state,
            error,
        }),
    ),
    on(
        FirebaseActions.getHardSkillsNavSuccess,
        (
            state: FirebaseState,
            { hardSkillsNav }: { hardSkillsNav: THardSkillsNav[] },
        ) => ({
            ...state,
            hardSkillsNav,
            error: null,
        }),
    ),
    on(
        FirebaseActions.getHardSkillsNavError,
        (state: FirebaseState, { error }: { error: Error | null }) => ({
            ...state,
            error,
        }),
    ),
    on(
        FirebaseActions.getEducationPlacesSuccess,
        (
            state: FirebaseState,
            { education }: { education: TWorkExperience[] | TEducationExperience[] },
        ) => ({
            ...state,
            education,
            error: null,
        }),
    ),
    on(
        FirebaseActions.getEducationPlacesError,
        (state: FirebaseState, { error }: { error: Error | null }) => ({
            ...state,
            error,
        }),
    ),
    on(
        FirebaseActions.getMainPageInfoSuccess,
        (
            state: FirebaseState,
            { mainPageInfo }: { mainPageInfo: TMainPageInfo },
        ) => ({
            ...state,
            mainPageInfo,
            error: null,
        }),
    ),
    on(
        FirebaseActions.getMainPageInfoError,
        (state: FirebaseState, { error }: { error: Error | null }) => ({
            ...state,
            error,
        }),
    ),
    on(
        FirebaseActions.getTechnologiesAsideSuccess,
        (
            state: FirebaseState,
            { technologiesAside }: { technologiesAside: TTechnologiesAside[] },
        ) => ({
            ...state,
            technologiesAside,
            error: null,
        }),
    ),
    on(
        FirebaseActions.getTechnologiesAsideError,
        (state: FirebaseState, { error }: { error: Error | null }) => ({
            ...state,
            error,
        }),
    ),
    on(
        FirebaseActions.getExperienceAsideSuccess,
        (
            state: FirebaseState,
            { experienceAside }: { experienceAside: TExperienceAside[] },
        ) => ({
            ...state,
            experienceAside,
            error: null,
        }),
    ),
    on(
        FirebaseActions.getExperienceAsideError,
        (state: FirebaseState, { error }: { error: Error | null }) => ({
            ...state,
            error,
        }),
    ),
);
