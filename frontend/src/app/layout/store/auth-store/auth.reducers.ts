// auth.reducers.ts
import { createReducer, on } from '@ngrx/store';

import { TAuthState } from '../model/auth-state.type';
import { AuthActions } from './auth.actions';

export const initialState: TAuthState = {
    user: null,
    isFetching: false,
};

export const authReducer = createReducer(
    initialState,
    on(
        AuthActions.getLoginSuccess,
        (state: TAuthState, { user }: { user: any }) => ({
            ...state,
            user,
        }),
    ),
    on(
        AuthActions.getLoginError,
        (state: TAuthState, { error }: { error: any }) => ({
            ...state,
            error,
        }),
    ),
    on(AuthActions.getLogoutSuccess, (state: TAuthState) => ({
        ...state,
    })),
    on(
        AuthActions.getLoginError,
        (state: TAuthState, { error }: { error: any }) => ({
            ...state,
            error,
        }),
    ),
);
