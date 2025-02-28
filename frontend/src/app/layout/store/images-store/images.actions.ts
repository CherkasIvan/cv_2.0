import { createActionGroup, props } from '@ngrx/store';

export const ImagesActions = createActionGroup({
    source: 'IMAGES',
    events: {
        'Get Logo': props<{ mode: boolean }>(),
        'Get Logo Success': props<{ logoUrl: string }>(),
        'Get Logo Failure': props<{ error: any }>(),

        'Get Profile Img': props<{ mode: boolean }>(),
        'Get Profile Img Success': props<{ profileUrl: string }>(),
        'Get Profile Img Failure': props<{ error: any }>(),

        'Get Close Img': props<{ mode: boolean }>(),
        'Get Close Img Success': props<{ closeUrl: string }>(),
        'Get Close Img Failure': props<{ error: any }>(),

        'Get Toggle Icons': props<{ mode: boolean }>(),
        'Get Toggle Icons Success': props<{ toggleUrl: string }>(),
        'Get Toggle Icons Failure': props<{ error: any }>(),

        'Get Arrow Icons': props<{ mode: boolean }>(),
        'Get Arrow Icons Success': props<{ arrowUrl: string }>(),
        'Get Arrow Icons Failure': props<{ error: any }>(),

        'Get Download Icons': props<{ mode: boolean }>(),
        'Get Download Icons Success': props<{ downloadUrl: string }>(),
        'Get Download Icons Failure': props<{ error: any }>(),
    },
});
