import { of } from 'rxjs';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ERoute } from '@app/core/enum/route.enum';
import { AuthService } from '@app/core/service/auth/auth.service';
import { LocalStorageService } from '@app/core/service/local-storage/local-storage.service';

import { TProfile } from '../model/profile.type';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
    constructor(
        private _actions$: Actions,
        private _authService$: AuthService,
        private _localStorageService: LocalStorageService,
        private _router: Router,
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

    loginGuest$ = createEffect(() =>
        this._actions$.pipe(
            ofType(AuthActions.getLoginGuest),
            mergeMap(() =>
                this._authService$.signInAsGuest().pipe(
                    map(() => AuthActions.getLoginGuestSuccess()),
                    catchError((error) =>
                        of(AuthActions.getLoginGuestError({ error })),
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
                    tap(() => this._router.navigate([ERoute.AUTH])),
                    tap(() => this._localStorageService.clearUserData()),
                    catchError((error) =>
                        of(AuthActions.getLogoutError({ error })),
                    ),
                ),
            ),
        ),
    );
}