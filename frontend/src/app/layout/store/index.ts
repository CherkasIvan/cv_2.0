import { Action } from '@ngrx/store';

import { darkModeReducer } from './dark-mode-store/dark-mode.reducers';
import { languageReducer } from './language-selector-store/language-selector.reducers';
import { spinnerReducer } from './spinner-store/spinner.reducer';

export interface GlobalState {
    isSpinnerOn: boolean;
    isDark: boolean;
    language: 'ru' | 'en';
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
            ? spinnerReducer({ isSpinnerOn: state?.isSpinnerOn }, action)
                  .isSpinnerOn
            : false,
        language: state
            ? languageReducer({ language: state.language }, action).language
            : 'ru',
    };
}
