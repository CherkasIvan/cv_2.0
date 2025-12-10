import { createReducer, on } from '@ngrx/store';

import { TSpinnerState } from '../model/spinner-state.type';
import { hideSpinner, showSpinner } from './spinner.actions';

export const initialSpinnerModeState: TSpinnerState = {
    isSpinnerOn: false,
};

export const spinnerReducer = createReducer(
    initialSpinnerModeState,
    on(showSpinner, (state: TSpinnerState) => ({
        ...state,
        isSpinnerOn: true,
    })),
    on(hideSpinner, (state: TSpinnerState) => ({
        ...state,
        isSpinnerOn: false,
    })),
);
