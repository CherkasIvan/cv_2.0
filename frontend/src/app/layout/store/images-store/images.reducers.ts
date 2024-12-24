import { createReducer, on } from '@ngrx/store';

import { ImagesActions } from './images.actions';

export interface LogoState {
    imageUrl: string;
    profileImageUrl: string;
    closeImageUrl: string;
    darkModeImageUrl: string;
    whiteModeImageUrl: string;
    error: any;
}

export const initialState: LogoState = {
    imageUrl: '',
    profileImageUrl: '',
    closeImageUrl: '',
    darkModeImageUrl: '',
    whiteModeImageUrl: '',
    error: null,
};

export const logoReducer = createReducer(
    initialState,
    on(ImagesActions.getLogoSuccess, (state, { imageUrl }) => ({
        ...state,
        imageUrl,
        error: null,
    })),
    on(ImagesActions.getLogoFailure, (state, { error }) => ({
        ...state,
        error,
    })),
    on(ImagesActions.getProfileImgSuccess, (state, { imageUrl }) => ({
        ...state,
        profileImageUrl: imageUrl,
        error: null,
    })),
    on(ImagesActions.getProfileImgFailure, (state, { error }) => ({
        ...state,
        error,
    })),
    on(ImagesActions.getCloseImgSuccess, (state, { imageUrl }) => ({
        ...state,
        closeImageUrl: imageUrl,
        error: null,
    })),
    on(ImagesActions.getCloseImgFailure, (state, { error }) => ({
        ...state,
        error,
    })),
    on(ImagesActions.getIconsWhiteModeSuccess, (state, { images }) => ({
        ...state,
        whiteModeImageUrl: images.join(', '),
        error: null,
    })),
    on(ImagesActions.getIconsWhiteModeFailure, (state, { error }) => ({
        ...state,
        error,
    })),
    on(ImagesActions.getIconsDarkModeSuccess, (state, { images }) => ({
        ...state,
        darkModeImageUrl: images.join(', '),
        error: null,
    })),
    on(ImagesActions.getIconsDarkModeFailure, (state, { error }) => ({
        ...state,
        error,
    })),
);
