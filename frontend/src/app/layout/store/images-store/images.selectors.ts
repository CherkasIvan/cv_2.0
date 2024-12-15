import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LogoState } from './images.reducers';

export const selectLogoState = createFeatureSelector<LogoState>('logo');

export const selectImageUrl = createSelector(
    selectLogoState,
    (state: LogoState) => state.imageUrl,
);

export const selectProfileImageUrl = createSelector(
    selectLogoState,
    (state: LogoState) => state.profileImageUrl,
);

export const selectLogoError = createSelector(
    selectLogoState,
    (state: LogoState) => state.error,
);

export const selectCloseImageUrl = createSelector(
    selectLogoState,
    (state: LogoState) => state.closeImageUrl,
);

export const selectDarkModeImages = createSelector(
    selectLogoState,
    (state: LogoState) => state.darkModeImages,
);

export const selectWhiteModeImages = createSelector(
    selectLogoState,
    (state: LogoState) => state.whiteModeImages,
);
