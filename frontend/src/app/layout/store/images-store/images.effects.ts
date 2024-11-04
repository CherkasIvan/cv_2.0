import { of } from 'rxjs';

import { Injectable } from '@angular/core';

import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ApiService } from '@core/service/api/api.service';

import { ImagesActions } from './images.actions';

@Injectable()
export class LogoEffects {
    constructor(
        private actions$: Actions,
        private apiService: ApiService,
    ) {}

    getLogo$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ImagesActions.getLogo),
            mergeMap((action) =>
                this.apiService
                    .getImages(action.mode ? 'white-mode' : 'dark-mode')
                    .pipe(
                        map((data) => {
                            const imageUrl =
                                data?.find((url: string) =>
                                    url.includes('logo-i.cherkas'),
                                ) || '';
                            return ImagesActions.getLogoSuccess({ imageUrl });
                        }),
                        catchError((error) =>
                            of(ImagesActions.getLogoFailure({ error })),
                        ),
                    ),
            ),
        ),
    );

    getProfileImg$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ImagesActions.getProfileImg),
            mergeMap((action) =>
                this.apiService
                    .getImages(action.mode ? 'white-mode' : 'dark-mode')
                    .pipe(
                        map((data) => {
                            const imageUrl =
                                data?.find((url: string) =>
                                    url.includes('profile-i.cherkas'),
                                ) || '';
                            return ImagesActions.getProfileImgSuccess({
                                imageUrl,
                            });
                        }),
                        catchError((error) =>
                            of(ImagesActions.getProfileImgFailure({ error })),
                        ),
                    ),
            ),
        ),
    );
}
