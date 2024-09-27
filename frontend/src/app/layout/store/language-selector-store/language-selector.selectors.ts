import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TLanguages } from '../model/languages.type';

export const languageFeatureSelector =
    createFeatureSelector<TLanguages>('language');

export const languageSelector = createSelector(
    languageFeatureSelector,
    (state: TLanguages) => state?.language ?? 'ru',
);
