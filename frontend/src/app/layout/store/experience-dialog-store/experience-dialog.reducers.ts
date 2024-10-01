import { createReducer, on } from '@ngrx/store';

import { IExperience } from '@core/models/experience.interface';

import { ExperienceActions } from './experience-dialog.actions';

export interface ModalState {
    isOpen: boolean;
    data: IExperience | null;
}

export const initialState: ModalState = {
    isOpen: false,
    data: null,
};

export const experienceDialogReducer = createReducer(
    initialState,
    on(ExperienceActions.getExperienceDialogOpen, (state, { data }) => ({
        ...state,
        isOpen: true,
        data,
    })),
    on(ExperienceActions.getExperienceDialogClosed, (state) => ({
        ...state,
        isOpen: false,
        data: null,
    })),
);
