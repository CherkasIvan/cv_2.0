import { Action } from '@ngrx/store';

import { darkModeReducer } from './dark-mode-store/dark-mode.reducers';
import { languageReducer } from './language-selector-store/language.reducers';
import { LanguageState } from './model/language-state.interface';
import { spinnerReducer } from './spinner-store/spinner.reducer';

export interface GlobalState {
    isSpinnerOn: boolean;
    isDark: boolean;
    language: LanguageState;
}

export const globalSetReducersKey = 'globalSetReducers';

export function globalSetReducers(
    state: GlobalState | undefined,
    action: Action,
): GlobalState {
    return {
        isDark: state
            ? darkModeReducer({ isDark: state.isDark }, action).isDark
            : false,
        isSpinnerOn: state
            ? spinnerReducer({ isSpinnerOn: state.isSpinnerOn }, action)
                  .isSpinnerOn
            : false,
        language: state
            ? languageReducer(state.language, action)
            : { currentLanguage: 'ru' },
    };
}
