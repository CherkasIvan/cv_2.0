import { createReducer, on } from '@ngrx/store';

import { LanguageState } from '../model/language-state.interface';
import { setLanguageSuccess } from './language.actions';

export const initialLanguageState: LanguageState = {
    currentLanguage: 'ru',
};

export const languageReducer = createReducer(
    initialLanguageState,
    on(setLanguageSuccess, (state, { currentLanguage }) => ({
        ...state,
        currentLanguage,
    })),
);
