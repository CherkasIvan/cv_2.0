import { createReducer, on } from '@ngrx/store';

import { ImagesActions } from './images.actions';

export interface LogoState {
    imageUrl: string;
    profileImageUrl: string;
    error: any;
}

export const initialState: LogoState = {
    imageUrl: '',
    profileImageUrl: '',
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
);
