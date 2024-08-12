import { of } from 'rxjs';

import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AuthService } from '@app/core/service/auth/auth.service';

import { TProfile } from '../model/profile.type';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
    constructor(
        private _actions$: Actions,
        private _authService$: AuthService,
    ) {}

    loginUser$ = createEffect(() =>
        this._actions$.pipe(
            ofType(AuthActions.getLogin),
            mergeMap((action) =>
                this._authService$.signIn(action.email, action.password).pipe(
                    map((userCredential) => {
                        const user: TProfile = {
                            uid: userCredential.user?.uid,
                            email: userCredential.user?.email,
                            displayName: userCredential.user?.displayName,
                            photoURL: userCredential.user?.photoURL,
                            emailVerified: userCredential.user?.emailVerified,
                        };
                        return AuthActions.getLoginSuccess({ user });
                    }),
                    catchError((error) =>
                        of(AuthActions.getLoginError({ error })),
                    ),
                ),
            ),
        ),
    );

    logoutUser$ = createEffect(() =>
        this._actions$.pipe(
            ofType(AuthActions.getLogout),
            mergeMap(() =>
                this._authService$.signOut().pipe(
                    map(() => AuthActions.getLogoutSuccess()),
                    catchError((error) =>
                        of(AuthActions.getLogoutError({ error })),
                    ),
                ),
            ),
        ),
    );
}
