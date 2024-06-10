import { Action } from '@ngrx/store';

import { darkModeReducer } from './dark-mode-store/dark-mode.reducers';
import { spinnerReducer } from './spinner-store/spinner.reducer';

export interface GlobalState {
    isSpinnerOn: boolean;
    isDark: boolean;
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
    };
}
