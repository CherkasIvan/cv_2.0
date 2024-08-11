import { of } from 'rxjs';

import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { FirebaseService } from '@core/service/firebase/firebase.service';

import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private firebaseService: FirebaseService,
    ) {}

    loadNavigation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.getLogin),
            mergeMap(() =>
                this.firebaseService.getNavigation().pipe(
                    map((email, password) =>
                        AuthActions.getLoginSuccess({ email, password }),
                    ),
                    catchError((error) =>
                        of(AuthActions.getLoginError({ error })),
                    ),
                ),
            ),
        ),
    );
}
