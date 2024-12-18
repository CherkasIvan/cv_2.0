import { catchError, forkJoin, map, mergeMap, of } from 'rxjs';

import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { ApiService } from '@core/service/api/api.service';

import { FirebaseActions } from './firebase.actions';

@Injectable()
export class FirebaseEffects {
    constructor(
        private _actions$: Actions<Action<string>>,
        private _apiService: ApiService,
    ) {}

    loadNavigation$ = createEffect(() =>
        this._actions$.pipe(
            ofType(FirebaseActions.getNavigation),
            mergeMap((action) =>
                forkJoin({
                    navigation: this._apiService.getNavigation(),
                    images: this._apiService.getImages(action.imgName),
                }).pipe(
                    map(({ navigation, images }) =>
                        FirebaseActions.getNavigationSuccess({
                            navigation,
                            images,
                        }),
                    ),
                    catchError((error) =>
                        of(FirebaseActions.getNavigationError({ error })),
                    ),
                ),
            ),
        ),
    );

    loadSocialMediaLinks$ = createEffect(() =>
        this._actions$.pipe(
            ofType(FirebaseActions.getSocialMedia),
            mergeMap((action) =>
                forkJoin({
                    socialMediaLinks: this._apiService.getSocialMediaLinks(),
                    images: this._apiService.getImages(action.imgName),
                }).pipe(
                    map(({ socialMediaLinks, images }) =>
                        FirebaseActions.getSocialMediaSuccess({
                            socialMediaLinks,
                            images,
                        }),
                    ),
                    catchError((error) =>
                        of(FirebaseActions.getSocialMediaError({ error })),
                    ),
                ),
            ),
        ),
    );

    loadWorkExperience$ = createEffect(() =>
        this._actions$.pipe(
            ofType(FirebaseActions.getWorkExperience),
            mergeMap((action) =>
                forkJoin({
                    workExperience: this._apiService.getWorkExperience(),
                    images: this._apiService.getImages(action.imgName),
                }).pipe(
                    map(({ workExperience, images }) =>
                        FirebaseActions.getWorkExperienceSuccess({
                            workExperience,
                            images,
                        }),
                    ),
                    catchError((error) =>
                        of(FirebaseActions.getWorkExperienceError({ error })),
                    ),
                ),
            ),
        ),
    );

    loadFrontendTech$ = createEffect(() =>
        this._actions$.pipe(
            ofType(FirebaseActions.getFrontendTech),
            mergeMap((action) =>
                forkJoin({
                    frontendTech: this._apiService.getFrontendTech(),
                    images: this._apiService.getImages(action.imgName),
                }).pipe(
                    map(({ frontendTech, images }) =>
                        FirebaseActions.getFrontendTechSuccess({
                            frontendTech,
                            images,
                        }),
                    ),
                    catchError((error) =>
                        of(FirebaseActions.getFrontendTechError({ error })),
                    ),
                ),
            ),
        ),
    );

    loadBackendTech$ = createEffect(() =>
        this._actions$.pipe(
            ofType(FirebaseActions.getBackendTech),
            mergeMap((action) =>
                forkJoin({
                    backendTech: this._apiService.getBackendTech(),
                    images: this._apiService.getImages(action.imgName),
                }).pipe(
                    map(({ backendTech, images }) =>
                        FirebaseActions.getBackendTechSuccess({
                            backendTech,
                            images,
                        }),
                    ),
                    catchError((error) =>
                        of(FirebaseActions.getBackendTechError({ error })),
                    ),
                ),
            ),
        ),
    );

    loadOtherTech$ = createEffect(() =>
        this._actions$.pipe(
            ofType(FirebaseActions.getOtherTech),
            mergeMap((action) =>
                forkJoin({
                    otherTech: this._apiService.getOtherTech(),
                    images: this._apiService.getImages(action.imgName),
                }).pipe(
                    map(({ otherTech, images }) =>
                        FirebaseActions.getOtherTechSuccess({
                            otherTech,
                            images,
                        }),
                    ),
                    catchError((error) =>
                        of(FirebaseActions.getOtherTechError({ error })),
                    ),
                ),
            ),
        ),
    );

    loadHardSkillsNav$ = createEffect(() =>
        this._actions$.pipe(
            ofType(FirebaseActions.getHardSkillsNav),
            mergeMap((action) =>
                forkJoin({
                    hardSkillsNav: this._apiService.getHardSkillsNav(),
                    images: this._apiService.getImages(action.imgName),
                }).pipe(
                    map(({ hardSkillsNav, images }) =>
                        FirebaseActions.getHardSkillsNavSuccess({
                            hardSkillsNav,
                            images,
                        }),
                    ),
                    catchError((error) =>
                        of(FirebaseActions.getHardSkillsNavError({ error })),
                    ),
                ),
            ),
        ),
    );

    loadEducationPlaces$ = createEffect(() =>
        this._actions$.pipe(
            ofType(FirebaseActions.getEducationPlaces),
            mergeMap((action) =>
                forkJoin({
                    education: this._apiService.getEducationPlaces(),
                    images: this._apiService.getImages(action.imgName),
                }).pipe(
                    map(({ education, images }) =>
                        FirebaseActions.getEducationPlacesSuccess({
                            education,
                            images,
                        }),
                    ),
                    catchError((error) =>
                        of(FirebaseActions.getEducationPlacesError({ error })),
                    ),
                ),
            ),
        ),
    );

    loadMainPageInfo$ = createEffect(() =>
        this._actions$.pipe(
            ofType(FirebaseActions.getMainPageInfo),
            mergeMap((action) =>
                forkJoin({
                    mainPageInfo: this._apiService.getMainPageInfo(),
                    images: this._apiService.getImages(action.imgName),
                }).pipe(
                    map(({ mainPageInfo, images }) =>
                        FirebaseActions.getMainPageInfoSuccess({
                            mainPageInfo,
                            images,
                        }),
                    ),
                    catchError((error) =>
                        of(FirebaseActions.getMainPageInfoError({ error })),
                    ),
                ),
            ),
        ),
    );

    loadExperienceAside$ = createEffect(() =>
        this._actions$.pipe(
            ofType(FirebaseActions.getExperienceAside),
            mergeMap((action) =>
                forkJoin({
                    experienceAside: this._apiService.getExperienceAside(),
                    images: this._apiService.getImages(action.imgName),
                }).pipe(
                    map(({ experienceAside, images }) =>
                        FirebaseActions.getExperienceAsideSuccess({
                            experienceAside,
                            images,
                        }),
                    ),
                    catchError((error) =>
                        of(FirebaseActions.getExperienceAsideError({ error })),
                    ),
                ),
            ),
        ),
    );

    loadTechnologiesAside$ = createEffect(() =>
        this._actions$.pipe(
            ofType(FirebaseActions.getTechnologiesAside),
            mergeMap(() =>
                this._apiService.getTechnologiesAside().pipe(
                    mergeMap((technologiesAside) => {
                        const imageRequests = technologiesAside.map((tech) => {
                            if (tech.imgName) {
                                return this._apiService
                                    .getImages(tech.imgName)
                                    .pipe(
                                        map((images) => ({
                                            ...tech,
                                            images,
                                        })),
                                    );
                            } else {
                                return of(tech);
                            }
                        });
                        return forkJoin(imageRequests).pipe(
                            map((updatedTechnologiesAside) => {
                                const images = updatedTechnologiesAside
                                    .map((tech) => tech.images)
                                    .flat()
                                    .filter(
                                        (image): image is string =>
                                            image !== undefined,
                                    );

                                return FirebaseActions.getTechnologiesAsideSuccess(
                                    {
                                        technologiesAside:
                                            updatedTechnologiesAside,
                                        images,
                                    },
                                );
                            }),
                            catchError((error) =>
                                of(
                                    FirebaseActions.getTechnologiesAsideError({
                                        error,
                                    }),
                                ),
                            ),
                        );
                    }),
                    catchError((error) =>
                        of(
                            FirebaseActions.getTechnologiesAsideError({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );
}
