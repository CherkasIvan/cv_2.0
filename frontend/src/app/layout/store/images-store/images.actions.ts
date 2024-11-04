import { createActionGroup, props } from '@ngrx/store';

export const ImagesActions = createActionGroup({
    source: 'IMAGES',
    events: {
        getLogo: props<{ mode: boolean }>(),
        getLogoSuccess: props<{ imageUrl: string }>(),
        getLogoFailure: props<{ error: any }>(),

        getProfileImg: props<{ mode: boolean }>(),
        getProfileImgSuccess: props<{ imageUrl: string }>(),
        getProfileImgFailure: props<{ error: any }>(),
    },
});
