import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LanguageState } from '../model/language-state.interface';

export const languageFeatureSelector =
    createFeatureSelector<LanguageState>('language');
export const languageSelector = createSelector(
    languageFeatureSelector,
    (state: LanguageState) => state.language ?? 'ru',
);
