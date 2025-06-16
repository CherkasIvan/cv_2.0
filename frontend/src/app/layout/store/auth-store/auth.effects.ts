import { catchError, map, mergeMap, of, tap } from 'rxjs';

import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ERoute } from '@core/enum/route.enum';
import { AuthService } from '@core/service/auth/auth.service';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';

import { TProfile } from '../model/profile.type';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
    public modalClass = 'fade-in';
    @Output() emittedModalHide: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    constructor(
        private _actions$: Actions,
        private _authService$: AuthService,
        private _cacheStorageService: CacheStorageService,
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
                    tap(() => {
                        this.modalClass = 'fade-out';
                        setTimeout(() => {
                            this.emittedModalHide.emit(true);
                            this.modalClass = 'fade-in';
                        }, 1500);
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
                    tap(() => this._cacheStorageService.clearUserData()),
                    catchError((error) =>
                        of(AuthActions.getLogoutError({ error })),
                    ),
                ),
            ),
        ),
    );
}
