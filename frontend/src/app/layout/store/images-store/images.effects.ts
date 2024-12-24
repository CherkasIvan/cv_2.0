import { Subject, catchError, map, mergeMap, of, takeUntil } from 'rxjs';

import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { ApiService } from '@core/service/api/api.service';

import { ImagesActions } from './images.actions';

@Injectable()
export class ImagesEffects {
    private _destroyed$: Subject<void> = new Subject();

    constructor(
        private _actions$: Actions<Action<string>>,
        private _apiService: ApiService,
    ) {}

    getLogo$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ImagesActions.getLogo),
            mergeMap((action) =>
                this._apiService
                    .getImages(action.mode ? 'white-mode' : 'dark-mode')
                    .pipe(
                        takeUntil(this._destroyed$),
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
        this._actions$.pipe(
            ofType(ImagesActions.getProfileImg),
            mergeMap((action) =>
                this._apiService
                    .getImages(action.mode ? 'white-mode' : 'dark-mode')
                    .pipe(
                        takeUntil(this._destroyed$),
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

    getCloseImg$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ImagesActions.getCloseImg),
            mergeMap((action) =>
                this._apiService
                    .getImages(action.mode ? 'white-mode' : 'dark-mode')
                    .pipe(
                        takeUntil(this._destroyed$),
                        map((data) => {
                            const imageUrl =
                                data?.find((url: string) =>
                                    url.includes('close-i.cherkas'),
                                ) || '';
                            return ImagesActions.getCloseImgSuccess({
                                imageUrl,
                            });
                        }),
                        catchError((error) =>
                            of(ImagesActions.getCloseImgFailure({ error })),
                        ),
                    ),
            ),
        ),
    );

    loadIconsWhiteMode$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ImagesActions.getIconsWhiteMode),
            mergeMap(() =>
                this._apiService.getIconsWhiteMode().pipe(
                    map((images) =>
                        ImagesActions.getIconsWhiteModeSuccess({ images }),
                    ),
                    catchError((error) =>
                        of(ImagesActions.getIconsWhiteModeFailure({ error })),
                    ),
                ),
            ),
        ),
    );

    loadIconsDarkMode$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ImagesActions.getIconsDarkMode),
            mergeMap(() =>
                this._apiService.getIconsDarkMode().pipe(
                    map((images) =>
                        ImagesActions.getIconsDarkModeSuccess({ images }),
                    ),
                    catchError((error) =>
                        of(ImagesActions.getIconsDarkModeFailure({ error })),
                    ),
                ),
            ),
        ),
    );

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
