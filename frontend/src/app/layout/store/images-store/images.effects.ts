import { Subject, catchError, map, mergeMap, of, takeUntil } from 'rxjs';

import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ApiService } from '@core/service/api/api.service';

import { ImagesActions } from './images.actions';

@Injectable()
export class ImagesEffects {
    private _destroyed$: Subject<void> = new Subject();

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
        this.actions$.pipe(
            takeUntil(this._destroyed$),
            ofType(ImagesActions.getProfileImg),
            mergeMap((action) =>
                this.apiService
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

    loadThemelessPicturesImages$ = createEffect(() =>
        this.actions$.pipe(
            takeUntil(this._destroyed$),
            ofType(ImagesActions.loadThemelessPicturesImages),
            mergeMap(() =>
                this.apiService.getThemelessPicturesImages().pipe(
                    map((data) =>
                        ImagesActions.loadThemelessPicturesImagesSuccess({
                            darkModeImages: data.darkModeImages,
                            whiteModeImages: data.whiteModeImages,
                        }),
                    ),
                    catchError((error) =>
                        of(
                            ImagesActions.loadThemelessPicturesImagesFailure({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );
    setWhiteModeIconImg$ = createEffect(() =>
        this.actions$.pipe(
            takeUntil(this._destroyed$),
            ofType(ImagesActions.getCloseImg),
            mergeMap((action) =>
                this.apiService.getImages('white-mode').pipe(
                    map((data: any) => {
                        const images =
                            data.find((url: string) => url.includes('moon')) ||
                            '';
                        return ImagesActions.setWhiteModeImagesSuccess({
                            images,
                        });
                    }),
                    catchError((error) =>
                        of(ImagesActions.setWhiteModeImagesFailure({ error })),
                    ),
                ),
            ),
        ),
    );

    setDarkModeIconImg$ = createEffect(() =>
        this.actions$.pipe(
            takeUntil(this._destroyed$),
            ofType(ImagesActions.setDarkModeImagesSuccess),
            mergeMap((action) =>
                this.apiService.getImages('dark-mode').pipe(
                    takeUntil(this._destroyed$),
                    map((data: any) => {
                        console.log(data);
                        const images =
                            data.find((url: string) => url.includes('sun')) ||
                            '';
                        return ImagesActions.setDarkModeImagesSuccess({
                            images,
                        });
                    }),
                    catchError((error) =>
                        of(ImagesActions.setDarkModeImagesFailure({ error })),
                    ),
                ),
            ),
        ),
    );

    getCloseImg$ = createEffect(() =>
        this.actions$.pipe(
            takeUntil(this._destroyed$),
            ofType(ImagesActions.getCloseImg),
            mergeMap((action) =>
                this.apiService.getImages('icons/white-mode').pipe(
                    map((data: any) => {
                        console.log(data);
                        const imageUrl = data.find((el: any) =>
                            el.includes('close'),
                        );
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

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
