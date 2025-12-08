import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { TAuthResponse } from '@core/models/auth-response.type';
import { TRegistrationForm } from '@core/models/registration-form.type';

export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        // Login
        login: props<{ email: string; password: string }>(),
        loginSuccess: props<{ user: TAuthResponse; token: string }>(),
        loginFailure: props<{ error: string }>(),

        // Registration
        register: props<{ userData: TRegistrationForm }>(),
        registerSuccess: props<{ user: TAuthResponse; token: string }>(),
        registerFailure: props<{ error: string }>(),

        // Logout
        logout: emptyProps(),
        logoutSuccess: emptyProps(),
        logoutFailure: props<{ error: string }>(),

        // Check Authentication
        checkAuth: emptyProps(),
        checkAuthSuccess: props<{ user: TAuthResponse }>(),
        checkAuthFailure: emptyProps(),

        // Guest Login
        guestLogin: emptyProps(),
        guestLoginSuccess: props<{ user: TAuthResponse; token: string }>(),
        guestLoginFailure: props<{ error: string }>(),
    },
});
