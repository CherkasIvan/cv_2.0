import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TSpinnerState } from '../model/spinner-state.type';

export const spinnerFeatureSelector =
    createFeatureSelector<TSpinnerState>('spinner');

export const spinnerSelector = createSelector(
    spinnerFeatureSelector,
    (state: TSpinnerState) => state.isSpinnerOn,
);
