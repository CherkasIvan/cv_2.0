import { createFeatureSelector, createSelector } from '@ngrx/store';

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

export interface LogoState {
    imageUrl: string;
    profileImageUrl: string;
    closeImageUrl: string;
    error: any;
}
