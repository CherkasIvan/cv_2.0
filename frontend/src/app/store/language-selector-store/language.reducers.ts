import { createReducer, on } from '@ngrx/store';

import { LanguageState } from '@store/model/language-state.interface';

import { setLanguageSuccess } from './language.actions';

export const initialLanguageState: LanguageState = {
    currentLanguage: 'en',
};

export const languageReducer = createReducer(
    initialLanguageState,
    on(setLanguageSuccess, (state, { currentLanguage }) => ({
        ...state,
        currentLanguage,
    })),
);
