import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { TProfile } from '../model/profile.type';

export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        getLogin: props<{ email: string; password: string }>(),
        getLoginSuccess: props<{ user: TProfile }>(),
        getLoginError: props<{ error: unknown }>(),

        getLogout: emptyProps(),
        getLogoutSuccess: props<{ user: TProfile }>(),
        getLogoutError: props<{ error: unknown }>(),
    },
});
