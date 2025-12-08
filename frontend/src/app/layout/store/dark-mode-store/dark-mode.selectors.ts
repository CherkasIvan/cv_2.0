import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TDarkModeState } from '../model/dark-mode-state.type';

export const darkModeFeatureSelector =
    createFeatureSelector<TDarkModeState>('darkMode');

export const darkModeSelector = createSelector(
    darkModeFeatureSelector,
    (state: TDarkModeState) => state?.isDark ?? false,
);
