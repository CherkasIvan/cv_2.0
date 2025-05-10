import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { TProfile } from '@store/model/profile.type';

export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        getLogin: props<{ email: string; password: string }>(),
        getLoginSuccess: props<{ user: TProfile }>(),
        getLoginError: props<{ error: unknown }>(),

        getLoginGuest: emptyProps(),
        getLoginGuestSuccess: emptyProps(),
        getLoginGuestError: props<{ error: unknown }>(),

        getLogout: emptyProps(),
        getLogoutSuccess: emptyProps(),
        getLogoutError: props<{ error: unknown }>(),
    },
});
