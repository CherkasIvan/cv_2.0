import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TDarkMode } from '../model/dark-mode.type';

export const darkModeFeatureSelector =
    createFeatureSelector<TDarkMode>('darkMode');

export const darkModeSelector = createSelector(
    darkModeFeatureSelector,
    (state: TDarkMode) => state?.isDark ?? false,
);
