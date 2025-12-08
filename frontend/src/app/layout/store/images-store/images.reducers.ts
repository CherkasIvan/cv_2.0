import { createReducer, on } from '@ngrx/store';

import { ImagesActions } from './images.actions';

export interface ImagesState {
    logoUrl: string;
    profileUrl: string;
    closeUrl: string;
    toggleUrl: string;
    arrowUrl: string;
    downloadUrl: string;
    error: Error | null;
    loading: boolean;
}

export const initialImagesState: ImagesState = {
    logoUrl: '',
    profileUrl: '',
    closeUrl: '',
    toggleUrl: '',
    arrowUrl: '',
    downloadUrl: '',
    error: null,
    loading: false,
};

export const imagesReducer = createReducer(
    initialImagesState,

    on(ImagesActions.loadLogoSuccess, (state, { logoUrl }) => ({
        ...state,
        logoUrl,
        error: null,
        loading: false,
    })),

    on(ImagesActions.loadProfileImageSuccess, (state, { profileUrl }) => ({
        ...state,
        profileUrl,
        error: null,
        loading: false,
    })),

    on(ImagesActions.loadCloseImageSuccess, (state, { closeUrl }) => ({
        ...state,
        closeUrl,
        error: null,
        loading: false,
    })),

    on(ImagesActions.loadToggleIconsSuccess, (state, { toggleUrl }) => ({
        ...state,
        toggleUrl,
        error: null,
        loading: false,
    })),

    on(ImagesActions.loadArrowIconsSuccess, (state, { arrowUrl }) => ({
        ...state,
        arrowUrl,
        error: null,
        loading: false,
    })),

    on(ImagesActions.loadDownloadIconsSuccess, (state, { downloadUrl }) => ({
        ...state,
        downloadUrl,
        error: null,
        loading: false,
    })),

    on(
        ImagesActions.loadLogoFailure,
        ImagesActions.loadProfileImageFailure,
        ImagesActions.loadCloseImageFailure,
        ImagesActions.loadToggleIconsFailure,
        ImagesActions.loadArrowIconsFailure,
        ImagesActions.loadDownloadIconsFailure,
        (state, { error }) => ({
            ...state,
            error,
            loading: false,
        }),
    ),

    on(
        ImagesActions.loadLogo,
        ImagesActions.loadProfileImage,
        ImagesActions.loadCloseImage,
        ImagesActions.loadToggleIcons,
        ImagesActions.loadArrowIcons,
        ImagesActions.loadDownloadIcons,
        (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
    ),
);
