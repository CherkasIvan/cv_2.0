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
    on(ImagesActions.setDarkModeImagesSuccess, (state, { imageUrl }) => ({
        ...state,
        darkModeImageUrl: imageUrl,
    })),
    on(ImagesActions.setDarkModeImagesFailure, (state, { error }) => ({
        ...state,
        error,
    })),
    on(ImagesActions.setWhiteModeImagesSuccess, (state, { imageUrl }) => ({
        ...state,
        whiteModeImageUrl: imageUrl,
    })),
    on(ImagesActions.setWhiteModeImagesFailure, (state, { error }) => ({
        ...state,
        error,
    })),
);
