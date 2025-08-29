// images.reducers.ts
import { createReducer, on } from '@ngrx/store';

import { ImagesActions } from './images.actions';

export interface LogoState {
    logoUrl: string;
    profileUrl: string;
    closeUrl: string;
    toggleUrl: string;
    arrowUrl: string;
    downloadUrl: string;
    error: string | null;
}

export const initialState: LogoState = {
    logoUrl: '',
    profileUrl: '',
    closeUrl: '',
    toggleUrl: '',
    arrowUrl: '',
    downloadUrl: '',
    error: null,
};

export const logoReducer = createReducer(
    initialState,
    on(
        ImagesActions.getLogoSuccess,
        (state: LogoState, { logoUrl }: { logoUrl: string }) => ({
            ...state,
            logoUrl,
            error: null,
        }),
    ),
    on(
        ImagesActions.getLogoFailure,
        (state: LogoState, { error }: { error: string }) => ({
            ...state,
            error,
        }),
    ),
    on(
        ImagesActions.getProfileImgSuccess,
        (state: LogoState, { profileUrl }: { profileUrl: string }) => ({
            ...state,
            profileUrl,
            error: null,
        }),
    ),
    on(
        ImagesActions.getProfileImgFailure,
        (state: LogoState, { error }: { error: string }) => ({
            ...state,
            error,
        }),
    ),
    on(
        ImagesActions.getCloseImgSuccess,
        (state: LogoState, { closeUrl }: { closeUrl: string }) => ({
            ...state,
            closeUrl,
            error: null,
        }),
    ),
    on(
        ImagesActions.getCloseImgFailure,
        (state: LogoState, { error }: { error: string }) => ({
            ...state,
            error,
        }),
    ),
    on(
        ImagesActions.getToggleIconsSuccess,
        (state: LogoState, { toggleUrl }: { toggleUrl: string }) => ({
            ...state,
            toggleUrl,
            error: null,
        }),
    ),
    on(
        ImagesActions.getToggleIconsFailure,
        (state: LogoState, { error }: { error: string }) => ({
            ...state,
            error,
        }),
    ),
    on(
        ImagesActions.getArrowIconsSuccess,
        (state: LogoState, { arrowUrl }: { arrowUrl: string }) => ({
            ...state,
            arrowUrl,
            error: null,
        }),
    ),
    on(
        ImagesActions.getArrowIconsFailure,
        (state: LogoState, { error }: { error: string }) => ({
            ...state,
            error,
        }),
    ),
    on(
        ImagesActions.getDownloadIconsSuccess,
        (state: LogoState, { downloadUrl }: { downloadUrl: string }) => ({
            ...state,
            downloadUrl,
            error: null,
        }),
    ),
    on(
        ImagesActions.getDownloadIconsFailure,
        (state: LogoState, { error }: { error: string }) => ({
            ...state,
            error,
        }),
    ),
);
