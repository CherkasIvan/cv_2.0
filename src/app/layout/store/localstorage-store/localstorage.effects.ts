import { of, tap } from 'rxjs';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ERoute } from '@app/core/enum/route.enum';
import { AuthService } from '@app/core/service/auth/auth.service';
import { LocalStorageService } from '@app/core/service/local-storage/local-storage.service';

import { TLocalstorageUser } from '../model/localstorage-user.interface';
import { TProfile } from '../model/profile.type';
import { LocalstorageActions } from './localstorage.actions';

@Injectable()
export class Localstorageffects {
    constructor(
        private _actions$: Actions,
        private _authService$: AuthService,
        private _localStorageService: LocalStorageService,
        private _router: Router,
        private _store$: Store<TLocalstorageUser>,
    ) {}

    syncIsFirstTime$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(LocalstorageActions.updateIsFirstTime),
                tap((action) => {
                    this._localStorageService.setItem(
                        'isFirstTime',
                        JSON.stringify(action.isFirstTime),
                    );
                }),
            ),
        { dispatch: false },
    );

    syncGuestStatus$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(LocalstorageActions.updateGuestStatus),
                tap((action) => {
                    this._localStorageService.setItem(
                        'isGuest',
                        JSON.stringify(action.isGuest),
                    );
                }),
            ),
        { dispatch: false },
    );

    syncUser$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(LocalstorageActions.updateUser),
                tap((action) => {
                    this._localStorageService.setItem(
                        'user',
                        JSON.stringify(action.user),
                    );
                }),
            ),
        { dispatch: false },
    );

    syncRoute$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(LocalstorageActions.updateRoute),
                tap((action) => {
                    localStorage.setItem('route', JSON.stringify(action.route));
                }),
            ),
        { dispatch: false },
    );

    syncTheme$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(LocalstorageActions.updateMode),
                tap((action) => {
                    this._localStorageService.setItem(
                        'isDark',
                        JSON.stringify(action.isDark),
                    );
                }),
            ),
        { dispatch: false },
    );

    syncLanguage$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(LocalstorageActions.updateLanguage),
                tap((action) => {
                    localStorage.setItem(
                        'language',
                        JSON.stringify(action.language),
                    );
                }),
            ),
        { dispatch: false },
    );
}
