import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TLanguagesState } from '../model/languages-state.type';

export const selectLanguageState =
    createFeatureSelector<TLanguagesState>('language');

export const selectCurrentLanguage = createSelector(
    selectLanguageState,
    (state: TLanguagesState) => state.currentLanguage,
);
