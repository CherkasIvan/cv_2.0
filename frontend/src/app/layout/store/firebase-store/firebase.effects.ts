import { of } from 'rxjs';

import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ApiService } from '@app/core/service/api/api.service';

import { FirebaseActions } from './firebase.actions';

@Injectable()
export class FirebaseEffects {
    constructor(
        private actions$: Actions,
        private _apiService: ApiService,
    ) {}

    loadNavigation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.getNavigation),
            mergeMap(() =>
                this._apiService.getNavigation().pipe(
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

    loadSocialMediaLinks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.getSocialMedia),
            mergeMap(() =>
                this._apiService.getSocialMediaLinks().pipe(
                    map((socialMediaLinks) =>
                        FirebaseActions.getSocialMediaSuccess({
                            socialMediaLinks,
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
        this.actions$.pipe(
            ofType(FirebaseActions.getWorkExperience),
            mergeMap(() =>
                this._apiService.getWorkExperience().pipe(
                    map((workExperience) =>
                        FirebaseActions.getWorkExperienceSuccess({
                            workExperience,
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
        this.actions$.pipe(
            ofType(FirebaseActions.getFrontendTech),
            mergeMap(() =>
                this._apiService.getFrontendTech().pipe(
                    map((frontendTech) =>
                        FirebaseActions.getFrontendTechSuccess({
                            frontendTech,
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
        this.actions$.pipe(
            ofType(FirebaseActions.getBackendTech),
            mergeMap(() =>
                this._apiService.getBackendTech().pipe(
                    map((backendTech) =>
                        FirebaseActions.getBackendTechSuccess({ backendTech }),
                    ),
                    catchError((error) =>
                        of(FirebaseActions.getBackendTechError({ error })),
                    ),
                ),
            ),
        ),
    );

    loadOtherTech$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.getOtherTech),
            mergeMap(() =>
                this._apiService.getOtherTech().pipe(
                    map((otherTech) =>
                        FirebaseActions.getOtherTechSuccess({ otherTech }),
                    ),
                    catchError((error) =>
                        of(FirebaseActions.getOtherTechError({ error })),
                    ),
                ),
            ),
        ),
    );

    loadHardSkillsNav$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.getHardSkillsNav),
            mergeMap(() =>
                this._apiService.getHardSkillsNav().pipe(
                    map((hardSkillsNav) =>
                        FirebaseActions.getHardSkillsNavSuccess({
                            hardSkillsNav,
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
        this.actions$.pipe(
            ofType(FirebaseActions.getEducationPlaces),
            mergeMap(() =>
                this._apiService.getEducationPlaces().pipe(
                    map((education) =>
                        FirebaseActions.getEducationPlacesSuccess({
                            education,
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
        this.actions$.pipe(
            ofType(FirebaseActions.getMainPageInfo),
            mergeMap(() =>
                this._apiService.getMainPageInfo().pipe(
                    map((mainPageInfo) =>
                        FirebaseActions.getMainPageInfoSuccess({
                            mainPageInfo,
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
        this.actions$.pipe(
            ofType(FirebaseActions.getExperienceAside),
            mergeMap(() =>
                this._apiService.getExperienceAside().pipe(
                    map((experienceAside) =>
                        FirebaseActions.getExperienceAsideSuccess({
                            experienceAside,
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
        this.actions$.pipe(
            ofType(FirebaseActions.getTechnologiesAside),
            mergeMap(() =>
                this._apiService.getTechnologiesAside().pipe(
                    map((technologiesAside) =>
                        FirebaseActions.getTechnologiesAsideSuccess({
                            technologiesAside,
                        }),
                    ),
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
