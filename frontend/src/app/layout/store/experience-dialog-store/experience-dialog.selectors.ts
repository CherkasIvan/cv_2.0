import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ModalState } from './experience-dialog.reducers';

export const selectModalState = createFeatureSelector<ModalState>('experience');

export const selectIsModalOpen = createSelector(
    selectModalState,
    (state: ModalState) => state.isOpen,
);

export const selectModalData = createSelector(
    selectModalState,
    (state: ModalState) => state.data,
);
