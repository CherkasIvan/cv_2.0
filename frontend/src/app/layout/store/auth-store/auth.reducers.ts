import { createReducer, on } from '@ngrx/store';

import { TAuthState } from '../model/auth-state.type';
import { AuthActions } from './auth.actions';

export const initialState: TAuthState = {
    user: null,
    isFetching: false,
};

export const authReducer = createReducer(
    initialState,

    on(AuthActions.getLoginSuccess, (state, { user }) => ({
        ...state,
        user,
    })),
    on(AuthActions.getLoginError, (state, { error }) => ({
        ...state,
        error,
    })),

    on(AuthActions.getLogoutSuccess, (state) => ({
        ...state,
    })),
    on(AuthActions.getLoginError, (state, { error }) => ({
        ...state,
        error,
    })),
);
