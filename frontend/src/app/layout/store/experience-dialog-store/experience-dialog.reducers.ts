import { createReducer, on } from '@ngrx/store';

import { IEducationExperience } from '@app/core/models/education.interface';
import { IWorkExperience } from '@app/core/models/work-experience.interface';

import { ExperienceActions } from './experience-dialog.actions';

export interface ModalState {
    isOpen: boolean;
    data: IWorkExperience | IEducationExperience | null;
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
