import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { TProfile } from '../model/profile.type';

export const LocalstorageActions = createActionGroup({
    source: 'LocalstorageActions',
    events: {
        updateIsFirstTime: props<{ isFirstTime: boolean }>(),
        updateGuestStatus: props<{ isGuest: boolean }>(),
        updateUser: props<{ user: TProfile }>(),
        updateRoute: props<{ route: string }>(),
        updateMode: props<{ isDark: boolean }>(),
        updateLanguage: props<{ language: 'ru' | 'en' }>(),
        clearSrorage: emptyProps(),
    },
});
