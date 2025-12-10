import { catchError, map, mergeMap, of } from 'rxjs';

import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ApiService } from '@core/service/api/api.service';

import { ImagesActions } from './images.actions';

@Injectable()
export class ImagesEffects {
    private readonly actions$ = inject(Actions);
    private readonly apiService = inject(ApiService);
    private readonly destroyRef = inject(DestroyRef);

    private createImageEffect(
        action: any,
        findPredicate: (url: string, mode: boolean) => boolean,
    ) {
        return createEffect(() =>
            this.actions$.pipe(
                ofType(action),
                mergeMap(({ mode }) =>
                    this.apiService
                        .getImages(
                            mode ? 'white-mode/' : 'dark-mode/',
                            mode ? 'white-mode' : 'dark-mode',
                        )
                        .pipe(
                            takeUntilDestroyed(this.destroyRef),
                            map((data: string[]) => {
                                console.log('Received image data:', data);
                                console.log('Mode:', mode);

                                // Проверяем, есть ли вообще данные
                                if (!data || data.length === 0) {
                                    console.warn(
                                        'No images found, returning empty string',
                                    );
                                    return this.getSuccessAction(
                                        action.type,
                                        '',
                                    );
                                }

                                const imageUrl =
                                    data.find((url: string) =>
                                        findPredicate(url, mode),
                                    ) || '';

                                return this.getSuccessAction(
                                    action.type,
                                    imageUrl,
                                );
                            }),
                            catchError((error: Error) =>
                                of(this.getFailureAction(action.type, error)),
                            ),
                        ),
                ),
            ),
        );
    }

    private getSuccessAction(actionType: string, url: string) {
        const actionMap: { [key: string]: any } = {
            [ImagesActions.loadLogo.type]: ImagesActions.loadLogoSuccess({
                logoUrl: url,
            }),
            [ImagesActions.loadProfileImage.type]:
                ImagesActions.loadProfileImageSuccess({ profileUrl: url }),
            [ImagesActions.loadCloseImage.type]:
                ImagesActions.loadCloseImageSuccess({ closeUrl: url }),
            [ImagesActions.loadToggleIcons.type]:
                ImagesActions.loadToggleIconsSuccess({ toggleUrl: url }),
            [ImagesActions.loadArrowIcons.type]:
                ImagesActions.loadArrowIconsSuccess({ arrowUrl: url }),
            [ImagesActions.loadDownloadIcons.type]:
                ImagesActions.loadDownloadIconsSuccess({ downloadUrl: url }),
        };
        return actionMap[actionType];
    }

    private getFailureAction(actionType: string, error: Error) {
        const actionMap: { [key: string]: any } = {
            [ImagesActions.loadLogo.type]: ImagesActions.loadLogoFailure({
                error,
            }),
            [ImagesActions.loadProfileImage.type]:
                ImagesActions.loadProfileImageFailure({ error }),
            [ImagesActions.loadCloseImage.type]:
                ImagesActions.loadCloseImageFailure({ error }),
            [ImagesActions.loadToggleIcons.type]:
                ImagesActions.loadToggleIconsFailure({ error }),
            [ImagesActions.loadArrowIcons.type]:
                ImagesActions.loadArrowIconsFailure({ error }),
            [ImagesActions.loadDownloadIcons.type]:
                ImagesActions.loadDownloadIconsFailure({ error }),
        };
        return actionMap[actionType];
    }

    loadLogo$ = this.createImageEffect(ImagesActions.loadLogo, (url: string) =>
        url.includes('logo-i.cherkas'),
    );

    loadProfileImage$ = this.createImageEffect(
        ImagesActions.loadProfileImage,
        (url: string) => url.includes('profile-i.cherkas'),
    );

    loadCloseImage$ = this.createImageEffect(
        ImagesActions.loadCloseImage,
        (url: string) => url.includes('close'),
    );

    loadToggleIcons$ = this.createImageEffect(
        ImagesActions.loadToggleIcons,
        (url: string, mode: boolean) =>
            mode ? url.includes('moon') : url.includes('sun'),
    );

    loadArrowIcons$ = this.createImageEffect(
        ImagesActions.loadArrowIcons,
        (url: string, mode: boolean) =>
            mode ? url.includes('arrow-wm') : url.includes('arrow'),
    );

    loadDownloadIcons$ = this.createImageEffect(
        ImagesActions.loadDownloadIcons,
        (url: string, mode: boolean) =>
            mode ? url.includes('download-wm') : url.includes('download'),
    );
}
