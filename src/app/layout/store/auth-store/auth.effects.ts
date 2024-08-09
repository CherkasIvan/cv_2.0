import { of } from 'rxjs';

import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { FirebaseService } from '@core/service/firebase/firebase.service';

import { FirebaseActions } from './firebase.actions';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private firebaseService: FirebaseService,
    ) {}

    loadNavigation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.getNavigation),
            mergeMap(() =>
                this.firebaseService.getNavigation().pipe(
                    map((navigation) =>
                        FirebaseActions.getNavigationSuccess({ navigation }),
                    ),
                    catchError((error) =>
                        of(FirebaseActions.getNavigationError({ error })),
                    ),
                ),
            ),
        ),
    );
}
