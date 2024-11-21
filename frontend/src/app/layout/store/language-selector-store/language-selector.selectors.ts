import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LanguageState } from './language-selector.reducers';

export const languageFeatureSelector =
    createFeatureSelector<LanguageState>('language');

export const languageSelector = createSelector(
    languageFeatureSelector,
    (state: LanguageState) => state.language,
);
