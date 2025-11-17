import { createReducer, on } from '@ngrx/store';

import { ExperienceActions } from './experience-dialog.actions';
import { TWorkExperience } from '@core/models/work-experience.type';
import { TEducationExperience } from '@core/models/education-experience.type';

export interface ModalState {
    isOpen: boolean;
    data: TWorkExperience | TEducationExperience | null;
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
