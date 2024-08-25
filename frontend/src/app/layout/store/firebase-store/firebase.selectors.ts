import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FirebaseState } from './firebase.reducers';

export const selectFirebaseState =
    createFeatureSelector<FirebaseState>('firebase');

export const selectNavigation = createSelector(
    selectFirebaseState,
    (state: FirebaseState) => state.navigation,
);

export const selectSocialMediaLinks = createSelector(
    selectFirebaseState,
    (state: FirebaseState) => state.socialMediaLinks,
);

export const selectWorkExperience = createSelector(
    selectFirebaseState,
    (state: FirebaseState) => state.workExperience,
);

export const selectFrontendTech = createSelector(
    selectFirebaseState,
    (state: FirebaseState) => state.frontendTech,
);

export const selectBackendTech = createSelector(
    selectFirebaseState,
    (state: FirebaseState) => state.backendTech,
);

export const selectOtherTech = createSelector(
    selectFirebaseState,
    (state: FirebaseState) => state.otherTech,
);

export const selectHardSkillsNav = createSelector(
    selectFirebaseState,
    (state: FirebaseState) => state.hardSkillsNav,
);

export const selectEducation = createSelector(
    selectFirebaseState,
    (state: FirebaseState) => state.education,
);

export const selectMainPageInfo = createSelector(
    selectFirebaseState,
    (state: FirebaseState) => state.mainPageInfo,
);

export const selectError = createSelector(
    selectFirebaseState,
    (state: FirebaseState) => state.error,
);

export const selectTechnologiesAside = createSelector(
    selectFirebaseState,
    (state: FirebaseState) => state.technologiesAside,
);

export const selectExperienceAside = createSelector(
    selectFirebaseState,
    (state: FirebaseState) => state.experienceAside,
);
