import { createActionGroup, props } from '@ngrx/store';

export const ImagesActions = createActionGroup({
    source: 'Images API',
    events: {
        'Load Logo': props<{ mode: boolean }>(),
        'Load Logo Success': props<{ logoUrl: string }>(),
        'Load Logo Failure': props<{ error: Error }>(),

        'Load Profile Image': props<{ mode: boolean }>(),
        'Load Profile Image Success': props<{ profileUrl: string }>(),
        'Load Profile Image Failure': props<{ error: Error }>(),

        'Load Close Image': props<{ mode: boolean }>(),
        'Load Close Image Success': props<{ closeUrl: string }>(),
        'Load Close Image Failure': props<{ error: Error }>(),

        'Load Toggle Icons': props<{ mode: boolean }>(),
        'Load Toggle Icons Success': props<{ toggleUrl: string }>(),
        'Load Toggle Icons Failure': props<{ error: Error }>(),

        'Load Arrow Icons': props<{ mode: boolean }>(),
        'Load Arrow Icons Success': props<{ arrowUrl: string }>(),
        'Load Arrow Icons Failure': props<{ error: Error }>(),

        'Load Download Icons': props<{ mode: boolean }>(),
        'Load Download Icons Success': props<{ downloadUrl: string }>(),
        'Load Download Icons Failure': props<{ error: Error }>(),
    },
});
