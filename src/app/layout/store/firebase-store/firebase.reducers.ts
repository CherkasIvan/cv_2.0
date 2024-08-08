import { createReducer, on } from '@ngrx/store';

import { IEducation } from '@core/models/education.interface';
import { IMainPageInfo } from '@core/models/main-page-info';
import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
import { ITechnologies } from '@core/models/technologies.interface';
import { IWorkExperience } from '@core/models/work-experience.interface';

import { FirebaseActions } from './firebase.actions';

export interface FirebaseState {
    navigation: INavigation[];
    socialMediaLinks: ISocialMedia[];
    workExperience: IWorkExperience[];
    frontendTech: ITechnologies[];
    backendTech: ITechnologies[];
    otherTech: ITechnologies[];
    hardSkillsNav: INavigation[];
    education: IEducation[];
    mainPageInfo: IMainPageInfo | null;
    error: any;
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
    error: null,
};

export const firebaseReducer = createReducer(
    initialFirebaseState,
    on(FirebaseActions.getNavigationSuccess, (state, { navigation }) => ({
        ...state,
        navigation,
    })),
    on(FirebaseActions.getNavigationError, (state, { error }) => ({
        ...state,
        error,
    })),
    on(
        FirebaseActions.getSocialMediaSuccess,
        (state, { socialMediaLinks }) => ({
            ...state,
            socialMediaLinks,
        }),
    ),
    on(FirebaseActions.getSocialMediaError, (state, { error }) => ({
        ...state,
        error,
    })),
    on(
        FirebaseActions.getWorkExperienceSuccess,
        (state, { workExperience }) => ({
            ...state,
            workExperience,
        }),
    ),
    on(FirebaseActions.getWorkExperienceError, (state, { error }) => ({
        ...state,
        error,
    })),
    on(FirebaseActions.getFrontendTechSuccess, (state, { frontendTech }) => ({
        ...state,
        frontendTech,
    })),
    on(FirebaseActions.getFrontendTechError, (state, { error }) => ({
        ...state,
        error,
    })),
    on(FirebaseActions.getBackendTechSuccess, (state, { backendTech }) => ({
        ...state,
        backendTech,
    })),
    on(FirebaseActions.getBackendTechError, (state, { error }) => ({
        ...state,
        error,
    })),
    on(FirebaseActions.getOtherTechSuccess, (state, { otherTech }) => ({
        ...state,
        otherTech,
    })),
    on(FirebaseActions.getOtherTechError, (state, { error }) => ({
        ...state,
        error,
    })),
    on(FirebaseActions.getHardSkillsNavSuccess, (state, { hardSkillsNav }) => ({
        ...state,
        hardSkillsNav,
    })),
    on(FirebaseActions.getHardSkillsNavError, (state, { error }) => ({
        ...state,
        error,
    })),
    on(FirebaseActions.getEducationPlacesSuccess, (state, { education }) => ({
        ...state,
        education,
    })),
    on(FirebaseActions.getEducationPlacesError, (state, { error }) => ({
        ...state,
        error,
    })),
    on(FirebaseActions.getMainPageInfoSuccess, (state, { mainPageInfo }) => ({
        ...state,
        mainPageInfo,
    })),
    on(FirebaseActions.getMainPageInfoError, (state, { error }) => ({
        ...state,
        error,
    })),
);
