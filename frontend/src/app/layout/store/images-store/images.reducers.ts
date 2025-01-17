import { createReducer, on } from '@ngrx/store';

import { ImagesActions } from './images.actions';

export interface LogoState {
    logoUrl: string;
    profileUrl: string;
    closeUrl: string;
    toggleUrl: string;
    error: any;
}

export const initialState: LogoState = {
    logoUrl: '',
    profileUrl: '',
    closeUrl: '',
    toggleUrl: '',
    error: null,
};

export const logoReducer = createReducer(
    initialState,
    on(ImagesActions.getLogoSuccess, (state, { logoUrl }) => {
        return {
            ...state,
            logoUrl,
            error: null,
        };
    }),
    on(ImagesActions.getLogoFailure, (state, { error }) => ({
        ...state,
        error,
    })),
    on(ImagesActions.getProfileImgSuccess, (state, { profileUrl }) => ({
        ...state,
        profileUrl,
        error: null,
    })),
    on(ImagesActions.getProfileImgFailure, (state, { error }) => ({
        ...state,
        error,
    })),
    on(ImagesActions.getCloseImgSuccess, (state, { closeUrl }) => {
        return {
            ...state,
            closeUrl,
            error: null,
        };
    }),
    on(ImagesActions.getCloseImgFailure, (state, { error }) => ({
        ...state,
        error,
    })),
    on(ImagesActions.getToggleIconsSuccess, (state, { toggleUrl }) => ({
        ...state,
        toggleUrl,
        error: null,
    })),
    on(ImagesActions.getToggleIconsFailure, (state, { error }) => ({
        ...state,
        error,
    })),
);
