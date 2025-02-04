import { Subject, catchError, map, mergeMap, of, takeUntil } from 'rxjs';

import { Injectable, OnDestroy } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ApiService } from '@core/service/api/api.service';

import { ImagesActions } from './images.actions';

@Injectable()
export class ImagesEffects implements OnDestroy {
    private _destroyed$: Subject<void> = new Subject();

    constructor(
        private _actions$: Actions,
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
                            const logoUrl =
                                data?.find((url: string) =>
                                    url.includes('logo-i.cherkas'),
                                ) || '';
                            return ImagesActions.getLogoSuccess({ logoUrl });
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
                            const profileUrl =
                                data?.find((url: string) =>
                                    url.includes('profile-i.cherkas'),
                                ) || '';
                            return ImagesActions.getProfileImgSuccess({
                                profileUrl,
                            });
                        }),
                        catchError((error) =>
                            of(ImagesActions.getProfileImgFailure({ error })),
                        ),
                    ),
            ),
        ),
    );

    loadIcons$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ImagesActions.getToggleIcons),
            mergeMap((action) =>
                this._apiService
                    .getImages(action.mode ? 'white-mode' : 'dark-mode')
                    .pipe(
                        takeUntil(this._destroyed$),
                        map((data) => {
                            const toggleUrl =
                                data?.find((url: string) =>
                                    action.mode
                                        ? url.includes('moon')
                                        : url.includes('sun'),
                                ) || '';
                            return ImagesActions.getToggleIconsSuccess({
                                toggleUrl,
                            });
                        }),
                        catchError((error) =>
                            of(ImagesActions.getToggleIconsFailure({ error })),
                        ),
                    ),
            ),
        ),
    );

    getArrowIcons$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ImagesActions.getArrowIcons),
            mergeMap((action) =>
                this._apiService
                    .getImages(
                        action.mode ? 'icons/white-mode' : 'icons/dark-mode',
                    )
                    .pipe(
                        takeUntil(this._destroyed$),
                        map((data) => {
                            console.log(action.mode);

                            const arrowUrl =
                                data?.find((url: string) =>
                                    action.mode
                                        ? url.includes('arrow-wm')
                                        : url.includes('arrow'),
                                ) || '';
                            console.log(arrowUrl);
                            return ImagesActions.getArrowIconsSuccess({
                                arrowUrl,
                            });
                        }),
                        catchError((error) =>
                            of(ImagesActions.getArrowIconsFailure({ error })),
                        ),
                    ),
            ),
        ),
    );

    getDownloadIcons$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ImagesActions.getDownloadIcons),
            mergeMap((action) =>
                this._apiService
                    .getImages(
                        action.mode ? 'icons/white-mode' : 'icons/dark-mode',
                    )
                    .pipe(
                        takeUntil(this._destroyed$),
                        map((data) => {
                            const downloadUrl =
                                data?.find((url: string) =>
                                    action.mode
                                        ? url.includes('download-wm')
                                        : url.includes('download'),
                                ) || '';
                            console.log(downloadUrl);
                            return ImagesActions.getDownloadIconsSuccess({
                                downloadUrl,
                            });
                        }),
                        catchError((error) =>
                            of(
                                ImagesActions.getDownloadIconsFailure({
                                    error,
                                }),
                            ),
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
                    .getImages(
                        action.mode ? 'icons/white-mode' : 'icons/dark-mode',
                    )
                    .pipe(
                        takeUntil(this._destroyed$),
                        map((data) => {
                            const closeUrl =
                                data?.find((url: string) =>
                                    url.includes('close'),
                                ) || '';
                            return ImagesActions.getCloseImgSuccess({
                                closeUrl,
                            });
                        }),
                        catchError((error) => {
                            console.error(
                                'Error fetching close image URL:',
                                error,
                            );
                            return of(
                                ImagesActions.getCloseImgFailure({ error }),
                            );
                        }),
                    ),
            ),
        ),
    );

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
