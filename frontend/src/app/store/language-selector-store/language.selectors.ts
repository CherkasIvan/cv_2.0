import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TLanguages } from '@store/model/languages.type';

export const selectLanguageState =
    createFeatureSelector<TLanguages>('language');

export const selectCurrentLanguage = createSelector(
    selectLanguageState,
    (state: TLanguages) => state.currentLanguage,
);
