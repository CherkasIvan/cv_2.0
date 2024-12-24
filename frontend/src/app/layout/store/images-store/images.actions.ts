import { createActionGroup, emptyProps, props } from '@ngrx/store';

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

        'Get Icons White Mode': emptyProps(),
        'Get Icons Dark Mode': emptyProps(),
        'Get Icons White Mode Success': props<{ images: string[] }>(),
        'Get Icons Dark Mode Success': props<{ images: string[] }>(),
        'Get Icons White Mode Failure': props<{ error: any }>(),
        'Get Icons Dark Mode Failure': props<{ error: any }>(),
    },
});
