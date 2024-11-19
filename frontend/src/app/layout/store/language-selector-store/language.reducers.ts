import { createReducer, on } from '@ngrx/store';

import { LanguageState } from '../model/language-state.interface';
import { setLanguageSuccess } from './language.actions';

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
