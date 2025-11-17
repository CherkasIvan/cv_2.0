import { createReducer, on } from '@ngrx/store';

import { LanguageState } from '../model/language-state.interface';
import { setLanguageSuccess } from './language.actions';

export const initialLanguageState: LanguageState = {
    language: 'en',
};

export const languageReducer = createReducer(
    initialLanguageState,
    on(
        setLanguageSuccess,
        (state: LanguageState, { language }: { language: 'en' | 'ru' }) => ({
            ...state,
            language,
        }),
    ),
);
