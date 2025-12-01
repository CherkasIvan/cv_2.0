import { createReducer, on } from '@ngrx/store';

import { TBackendTechnologies } from '@core/models/backend-technologies.type';
import { TEducationExperience } from '@core/models/education-experience.type';
import { TExperienceAside } from '@core/models/experience-aside.type';
import { TFrontendTechnologies } from '@core/models/frontend-technologies.type';
import { THardSkillsNav } from '@core/models/hard-skills-nav.type';
import { TMainPageInfo } from '@core/models/main-page-info';
import { TNavigation } from '@core/models/navigation.type';
import { TOtherTechnologies } from '@core/models/other-technologies.type';
import { TSocialMedia } from '@core/models/social-media.type';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { TWorkExperience } from '@core/models/work-experience.type';

import * as FirebaseActions from './firebase.actions';

export interface FirebaseState {
    navigation: TNavigation[];
    socialMediaLinks: TSocialMedia[];
    workExperience: TWorkExperience[];
    frontendTech: TFrontendTechnologies[];
    backendTech: TBackendTechnologies[];
    otherTech: TOtherTechnologies[];
    hardSkillsNav: THardSkillsNav[];
    education: (TEducationExperience | TWorkExperience)[];
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

    // Navigation
    on(FirebaseActions.loadNavigationSuccess, (state, { navigation }) => ({
        ...state,
        navigation,
        error: null,
    })),
    on(FirebaseActions.loadNavigationFailure, (state, { error }) => ({
        ...state,
        error,
    })),

    // Social Media
    on(
        FirebaseActions.loadSocialMediaSuccess,
        (state, { socialMediaLinks }) => ({
            ...state,
            socialMediaLinks,
            error: null,
        }),
    ),
    on(FirebaseActions.loadSocialMediaFailure, (state, { error }) => ({
        ...state,
        error,
    })),

    // Work Experience
    on(
        FirebaseActions.loadWorkExperienceSuccess,
        (state, { workExperience }) => ({
            ...state,
            workExperience,
            error: null,
        }),
    ),
    on(FirebaseActions.loadWorkExperienceFailure, (state, { error }) => ({
        ...state,
        error,
    })),

    // Frontend Tech
    on(FirebaseActions.loadFrontendTechSuccess, (state, { frontendTech }) => ({
        ...state,
        frontendTech,
        error: null,
    })),
    on(FirebaseActions.loadFrontendTechFailure, (state, { error }) => ({
        ...state,
        error,
    })),

    // Backend Tech
    on(FirebaseActions.loadBackendTechSuccess, (state, { backendTech }) => ({
        ...state,
        backendTech,
        error: null,
    })),
    on(FirebaseActions.loadBackendTechFailure, (state, { error }) => ({
        ...state,
        error,
    })),

    // Other Tech
    on(FirebaseActions.loadOtherTechSuccess, (state, { otherTech }) => ({
        ...state,
        otherTech,
        error: null,
    })),
    on(FirebaseActions.loadOtherTechFailure, (state, { error }) => ({
        ...state,
        error,
    })),

    // Hard Skills Nav
    on(
        FirebaseActions.loadHardSkillsNavSuccess,
        (state, { hardSkillsNav }) => ({
            ...state,
            hardSkillsNav,
            error: null,
        }),
    ),
    on(FirebaseActions.loadHardSkillsNavFailure, (state, { error }) => ({
        ...state,
        error,
    })),

    // Education Places
    on(FirebaseActions.loadEducationPlacesSuccess, (state, { education }) => ({
        ...state,
        education,
        error: null,
    })),
    on(FirebaseActions.loadEducationPlacesFailure, (state, { error }) => ({
        ...state,
        error,
    })),

    // Main Page Info
    on(FirebaseActions.loadMainPageInfoSuccess, (state, { mainPageInfo }) => ({
        ...state,
        mainPageInfo,
        error: null,
    })),
    on(FirebaseActions.loadMainPageInfoFailure, (state, { error }) => ({
        ...state,
        error,
    })),

    // Technologies Aside
    on(
        FirebaseActions.loadTechnologiesAsideSuccess,
        (state, { technologiesAside }) => ({
            ...state,
            technologiesAside,
            error: null,
        }),
    ),
    on(FirebaseActions.loadTechnologiesAsideFailure, (state, { error }) => ({
        ...state,
        error,
    })),

    // Experience Aside
    on(
        FirebaseActions.loadExperienceAsideSuccess,
        (state, { experienceAside }) => ({
            ...state,
            experienceAside,
            error: null,
        }),
    ),
    on(FirebaseActions.loadExperienceAsideFailure, (state, { error }) => ({
        ...state,
        error,
    })),
);
