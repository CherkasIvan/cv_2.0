import { createReducer, on } from '@ngrx/store';

import { setLanguageSuccess } from './language-selector.actions';

export interface languageState {
    isLanguage: boolean;
}

export const initialLanguageState: languageState = {
    isLanguage: false,
};

export const languageReducer = createReducer(
    initialLanguageState,
    on(setLanguageSuccess, (state, { isLanguage }) => ({
        ...state,
        isLanguage,
    })),
);
