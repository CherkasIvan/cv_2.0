import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ImagesState } from './images.reducers';

export const selectImagesState = createFeatureSelector<ImagesState>('images');

export const selectLogoUrl = createSelector(
    selectImagesState,
    (state: ImagesState) => state?.logoUrl || '',
);

export const selectProfileUrl = createSelector(
    selectImagesState,
    (state: ImagesState) => state?.profileUrl || '',
);

export const selectCloseUrl = createSelector(
    selectImagesState,
    (state: ImagesState) => state?.closeUrl || '',
);

export const selectToggleUrl = createSelector(
    selectImagesState,
    (state: ImagesState) => state?.toggleUrl || '',
);

export const selectArrowUrl = createSelector(
    selectImagesState,
    (state: ImagesState) => state?.arrowUrl || '',
);

export const selectDownloadUrl = createSelector(
    selectImagesState,
    (state: ImagesState) => state?.downloadUrl || '',
);

export const selectImagesError = createSelector(
    selectImagesState,
    (state: ImagesState) => state?.error || Error.name,
);

export const selectImagesLoading = createSelector(
    selectImagesState,
    (state: ImagesState) => state?.loading || false,
);
