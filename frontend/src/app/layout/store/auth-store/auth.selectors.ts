// auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TAuthState } from '@core/models/auth-state.type';

export const selectAuthState = createFeatureSelector<TAuthState>('auth');

export const selectAuthUser = createSelector(
    selectAuthState,
    (state: TAuthState) => state.user,
);

export const selectIsAuthenticated = createSelector(
    selectAuthState,
    (state: TAuthState) => state.isAuthenticated,
);

export const selectAuthToken = createSelector(
    selectAuthState,
    (state: TAuthState) => state.user?.token || null,
);

export const selectAuthLoading = createSelector(
    selectAuthState,
    (state: TAuthState) => state.isLoading,
);

export const selectAuthError = createSelector(
    selectAuthState,
    (state: TAuthState) => state.error,
);

// 🔄 Добавляем старый селектор для обратной совместимости
export const selectAuth = selectAuthUser;
