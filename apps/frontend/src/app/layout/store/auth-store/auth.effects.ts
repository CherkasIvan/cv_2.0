import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, of, switchMap, tap } from 'rxjs';

import { AuthService } from '@core/service/auth/auth.service';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private cacheStorageService = inject(CacheStorageService);
    private router = inject(Router);

    // 🎯 Login Effect
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            switchMap(({ email, password }) =>
                this.authService.signIn(email, password).pipe(
                    map((response) => {
                        if (response) {
                            return AuthActions.loginSuccess({
                                user: response.user,
                                token: response.token,
                            });
                        } else {
                            return AuthActions.loginFailure({
                                error: 'Login failed',
                            });
                        }
                    }),
                    catchError((error) =>
                        of(
                            AuthActions.loginFailure({
                                error: error.message || 'Login failed',
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );

    // 🎯 Registration Effect
    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.register),
            switchMap(({ userData }) =>
                this.authService.register(userData).pipe(
                    map((response) => {
                        if (response) {
                            return AuthActions.registerSuccess({
                                user: response.user,
                                token: response.token,
                            });
                        } else {
                            return AuthActions.registerFailure({
                                error: 'Registration failed',
                            });
                        }
                    }),
                    catchError((error) =>
                        of(
                            AuthActions.registerFailure({
                                error: error.message || 'Registration failed',
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );

    // 🎯 Logout Effect
    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            switchMap(() =>
                this.authService.signOut().pipe(
                    map(() => AuthActions.logoutSuccess()),
                    tap(() => {
                        this.router.navigate([ERoutes.AUTH]);
                        this.cacheStorageService.clearUserData();
                    }),
                    catchError((error) =>
                        of(
                            AuthActions.logoutFailure({
                                error: error.message || 'Logout failed',
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );

    // 🎯 Check Authentication Effect
    checkAuth$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.checkAuth),
            map(() => {
                const user = this.authService.getCurrentUser();
                return user
                    ? AuthActions.checkAuthSuccess({ user })
                    : AuthActions.checkAuthFailure();
            }),
        ),
    );

    // 🎯 Guest Login Effect
    guestLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.guestLogin),
            switchMap(() =>
                this.authService.signInAsGuest().pipe(
                    map((response) => {
                        if (response) {
                            return AuthActions.guestLoginSuccess({
                                user: response.user,
                                token: response.token,
                            });
                        } else {
                            return AuthActions.guestLoginFailure({
                                error: 'Guest login failed',
                            });
                        }
                    }),
                    catchError((error) =>
                        of(
                            AuthActions.guestLoginFailure({
                                error: error.message || 'Guest login failed',
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );

    // 🎯 Success Effects
    loginSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(
                    AuthActions.loginSuccess,
                    AuthActions.registerSuccess,
                    AuthActions.guestLoginSuccess,
                ),
                tap(() => {
                    this.router.navigate(['/layout']);
                }),
            ),
        { dispatch: false },
    );

    // 🎯 Store user data on success
    storeUserData$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(
                    AuthActions.loginSuccess,
                    AuthActions.registerSuccess,
                    AuthActions.guestLoginSuccess,
                    AuthActions.checkAuthSuccess,
                ),
                tap((action) => {
                    const user = 'user' in action ? action.user : null;
                    if (user) {
                        this.cacheStorageService.setUser(user).subscribe();
                    }
                }),
            ),
        { dispatch: false },
    );
}
