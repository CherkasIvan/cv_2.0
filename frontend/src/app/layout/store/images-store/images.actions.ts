import { createActionGroup, props } from '@ngrx/store';

export const ImagesActions = createActionGroup({
    source: 'IMAGES',
    events: {
        'Get Logo': props<{ mode: boolean }>(),
        'Get Logo Success': props<{ imageUrl: string }>(),
        'Get Logo Failure': props<{ error: any }>(),

        'Get Profile Img': props<{ mode: boolean }>(),
        'Get Profile Img Success': props<{ imageUrl: string }>(),
        'Get Profile Img Failure': props<{ error: any }>(),

        'Get Close Img': props<{ mode: boolean }>(),
        'Get Close Img Success': props<{ imageUrl: string }>(),
        'Get Close Img Failure': props<{ error: any }>(),

        'Set Dark Mode Images': props<{ mode: boolean }>(),
        'Set Dark Mode Images Success': props<{ imageUrl: string }>(),
        'Set Dark Mode Images Failure': props<{ error: any }>(),

        'Set White Mode Images': props<{ mode: boolean }>(),
        'Set White Mode Images Success': props<{ imageUrl: string }>(),
        'Set White Mode Images Failure': props<{ error: any }>(),
    },
});
