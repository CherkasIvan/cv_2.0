import { of } from 'rxjs';

import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { FirebaseService } from '@core/service/firebase/firebase.service';

import { FirebaseActions } from './firebase.actions';

@Injectable()
export class FirebaseEffects {
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

    loadSocialMediaLinks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.getSocialMedia),
            mergeMap(() =>
                this.firebaseService.getSocialMediaLinks().pipe(
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
                this.firebaseService.getWorkExperience().pipe(
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
                this.firebaseService.getFrontendTech().pipe(
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
                this.firebaseService.getBackendTech().pipe(
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
                this.firebaseService.getOtherTech().pipe(
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
                this.firebaseService.getHardSkillsNav().pipe(
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
                this.firebaseService.getEducationPlaces().pipe(
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
                this.firebaseService.getMainPageInfo().pipe(
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
}
