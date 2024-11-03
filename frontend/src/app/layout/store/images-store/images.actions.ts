import { createActionGroup, props } from '@ngrx/store';

export const ImagesActions = createActionGroup({
    source: 'HeaderLogo',
    events: {
        getLogo: props<{ mode: boolean }>(),
        getLogoSuccess: props<{ imageUrl: string }>(),
        getLogoFailure: props<{ error: any }>(),
    },
});
