// dark-mode.reducers.ts
import { createReducer, on } from '@ngrx/store';

import { setModeSuccess } from './dark-mode.actions';

export interface DarkModeState {
    isDark: boolean;
}

export const initialDarkModeState: DarkModeState = {
    isDark: false,
};

export const darkModeReducer = createReducer(
    initialDarkModeState,
    on(
        setModeSuccess,
        (state: DarkModeState, { isDark }: { isDark: boolean }) => ({
            ...state,
            isDark,
        }),
    ),
);
