import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ILanguagesSelector } from '../model/language-selector.interface';

export const languageFeatureSelector =
    createFeatureSelector<ILanguagesSelector>('language');

export const languageSelector = createSelector(
    languageFeatureSelector,
    (state: ILanguagesSelector) => state?.isLanguage ?? false,
);
