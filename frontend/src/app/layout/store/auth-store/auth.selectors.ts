import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TAuthState } from '../model/auth-state.type';

export const selectAuthState = createFeatureSelector<TAuthState>('auth');

export const selectAuth = createSelector(
    selectAuthState,
    (state: TAuthState) => state.user,
);
