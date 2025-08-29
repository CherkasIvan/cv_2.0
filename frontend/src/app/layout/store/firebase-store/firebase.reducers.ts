// firebase.reducers.ts
import { createReducer, on } from '@ngrx/store';

import { TExperienceAside } from '@core/models/experience-aside.type';
import { IExperience } from '@core/models/experience.interface';
import { IMainPageInfo } from '@core/models/main-page-info';
import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { ITechnologies } from '@core/models/technologies.interface';

import { FirebaseActions } from './firebase.actions';

export interface FirebaseState {
    navigation: INavigation[];
    socialMediaLinks: ISocialMedia[];
    workExperience: IExperience[];
    frontendTech: ITechnologies[];
    backendTech: ITechnologies[];
    otherTech: ITechnologies[];
    hardSkillsNav: INavigation[];
    education: IExperience[];
    mainPageInfo: IMainPageInfo | null;
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
            { navigation }: { navigation: INavigation[] },
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
            { socialMediaLinks }: { socialMediaLinks: ISocialMedia[] },
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
            { workExperience }: { workExperience: IExperience[] },
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
            { frontendTech }: { frontendTech: ITechnologies[] },
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
            { backendTech }: { backendTech: ITechnologies[] },
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
            { otherTech }: { otherTech: ITechnologies[] },
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
            { hardSkillsNav }: { hardSkillsNav: INavigation[] },
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
            { education }: { education: IExperience[] },
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
            { mainPageInfo }: { mainPageInfo: IMainPageInfo },
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
