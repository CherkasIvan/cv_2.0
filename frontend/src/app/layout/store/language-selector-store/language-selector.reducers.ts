import { createReducer, on } from '@ngrx/store';

import { setLanguageSuccess } from './language-selector.actions';

export interface languageState {
    language: 'ru' | 'en';
}

export const initialLanguageState: languageState = {
    language: 'ru',
};

export const languageReducer = createReducer(
    initialLanguageState,
    on(setLanguageSuccess, (state, { language }) => ({
        ...state,
        language,
    })),
);
