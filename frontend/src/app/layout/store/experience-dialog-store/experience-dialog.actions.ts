import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { IExperience } from '@core/models/experience.interface';

export const ExperienceActions = createActionGroup({
    source: 'ExperienceDialog',
    events: {
        getExperienceDialogOpen: props<{ data: IExperience | null }>(),
        getExperienceDialogClosed: emptyProps(),
    },
});
