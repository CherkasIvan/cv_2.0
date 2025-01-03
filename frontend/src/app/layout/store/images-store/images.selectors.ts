import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LogoState } from './images.reducers';

export const selectLogoState = createFeatureSelector<LogoState>('logo');

export const selectLogoUrl = createSelector(
    selectLogoState,
    (state: LogoState) => state.logoUrl,
);

export const selectProfileUrl = createSelector(
    selectLogoState,
    (state: LogoState) => state.profileUrl,
);

export const selectCloseUrl = createSelector(
    selectLogoState,
    (state: LogoState) => state.closeUrl,
);

export const selectToggleUrl = createSelector(
    selectLogoState,
    (state: LogoState) => state.toggleUrl,
);

export const selectLogoError = createSelector(
    selectLogoState,
    (state: LogoState) => state.error,
);
