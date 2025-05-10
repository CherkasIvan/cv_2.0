import { createAction } from '@ngrx/store';

export const setLanguage = createAction('[LANGUAGE_SELECTOR] Set mode');
export const setLanguageSuccess = createAction(
    '[LANGUAGE_SELECTOR] Set mode success',
    (currentLanguage: 'ru' | 'en') => ({ currentLanguage }),
);
