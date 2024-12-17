import { createReducer, on } from '@ngrx/store';

import { ImagesActions } from './images.actions';

export interface LogoState {
    imageUrl: string;
    profileImageUrl: string;
    closeImageUrl: string;
    darkModeImages: string[];
    whiteModeImages: string[];
    error: any;
}

export const initialState: LogoState = {
    imageUrl: '',
    profileImageUrl: '',
    closeImageUrl: '',
    darkModeImages: [],
    whiteModeImages: [],
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
    on(
        ImagesActions.loadThemelessPicturesImagesSuccess,
        (state, { darkModeImages, whiteModeImages }) => ({
            ...state,
            darkModeImages,
            whiteModeImages,
            error: null,
        }),
    ),
    on(
        ImagesActions.loadThemelessPicturesImagesFailure,
        (state, { error }) => ({
            ...state,
            error,
        }),
    ),
    on(ImagesActions.setDarkModeImages, (state, { images }) => ({
        ...state,
        darkModeImages: images,
    })),
    on(ImagesActions.setWhiteModeImages, (state, { images }) => ({
        ...state,
        whiteModeImages: images,
    })),
);
