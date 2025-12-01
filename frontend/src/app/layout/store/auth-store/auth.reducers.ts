import { createReducer, on } from '@ngrx/store';

import { TAuthState } from '@core/models/auth-state.type';

import { AuthActions } from './auth.actions';

export const initialState: TAuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

export const authReducer = createReducer(
    initialState,

    // Login
    on(AuthActions.login, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),
    on(AuthActions.loginSuccess, (state, { user, token }) => ({
        ...state,
        user: { ...user, token },
        isAuthenticated: true,
        isLoading: false,
        error: null,
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
        ...state,
        error,
        isLoading: false,
        isAuthenticated: false,
    })),

    // Registration
    on(AuthActions.register, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),
    on(AuthActions.registerSuccess, (state, { user, token }) => ({
        ...state,
        user: { ...user, token },
        isAuthenticated: true,
        isLoading: false,
        error: null,
    })),
    on(AuthActions.registerFailure, (state, { error }) => ({
        ...state,
        error,
        isLoading: false,
    })),

    // Logout
    on(AuthActions.logout, (state) => ({
        ...state,
        isLoading: true,
    })),
    on(AuthActions.logoutSuccess, () => ({
        ...initialState,
    })),
    on(AuthActions.logoutFailure, (state, { error }) => ({
        ...state,
        error,
        isLoading: false,
    })),

    // Check Auth
    on(AuthActions.checkAuthSuccess, (state, { user }) => ({
        ...state,
        user,
        isAuthenticated: true,
    })),
    on(AuthActions.checkAuthFailure, (state) => ({
        ...state,
        isAuthenticated: false,
    })),

    // Guest Login
    on(AuthActions.guestLogin, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),
    on(AuthActions.guestLoginSuccess, (state, { user, token }) => ({
        ...state,
        user: { ...user, token },
        isAuthenticated: true,
        isLoading: false,
        error: null,
    })),
    on(AuthActions.guestLoginFailure, (state, { error }) => ({
        ...state,
        error,
        isLoading: false,
    })),
);
