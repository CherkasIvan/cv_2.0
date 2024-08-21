import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { IEducationExperience } from '@core/models/education.interface';
import { IWorkExperience } from '@core/models/work-experience.interface';

export const ExperienceActions = createActionGroup({
    source: 'ExperienceDialog',
    events: {
        getExperienceDialogOpen: props<{
            data: IWorkExperience | IEducationExperience | null;
        }>(),
        getExperienceDialogClosed: emptyProps(),
    },
});
