import { Action } from '@ngrx/store';

import { spinnerReducer } from './spinner-store/spinner.reducer';

export interface GlobalState {
    isSpinnerOn: boolean;
}

export const globalSetReducersKey = 'globalSetReducers';

export function globalSetReducers(
    state: GlobalState | undefined,
    action: Action,
): GlobalState {
    return {
        isSpinnerOn: state
            ? spinnerReducer({ isSpinnerOn: state?.isSpinnerOn }, action)
                  .isSpinnerOn
            : false,
    };
}
