import { createReducer, on } from '@ngrx/store';

import { setLanguageSuccess } from './language-selector.actions';

export interface LanguageState {
    language: 'ru' | 'en';
}

export const initialLanguageState: LanguageState = {
    language: 'ru',
};

export const languageReducer = createReducer(
    initialLanguageState,
    on(setLanguageSuccess, (state, { language }) => ({
        ...state,
        language,
    })),
);
