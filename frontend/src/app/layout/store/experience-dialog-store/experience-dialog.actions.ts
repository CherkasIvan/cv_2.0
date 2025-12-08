import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { TEducationExperience } from '@core/models/education-experience.type';
import { TWorkExperience } from '@core/models/work-experience.type';

export const ExperienceActions = createActionGroup({
    source: 'ExperienceDialog',
    events: {
        getExperienceDialogOpen: props<{
            data: TWorkExperience | TEducationExperience | null;
        }>(),
        getExperienceDialogClosed: emptyProps(),
    },
});
