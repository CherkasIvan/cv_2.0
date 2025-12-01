import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { ApiService } from '@core/service/api/api.service';

import * as FirebaseActions from './firebase.actions';

@Injectable()
export class FirebaseEffects {
    private readonly actions$ = inject(Actions);
    private readonly apiService = inject(ApiService);
    private readonly destroyRef = inject(DestroyRef);

    // ✅ Navigation - обычно не требует изображений
    loadNavigation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.loadNavigation),
            switchMap(() =>
                this.apiService.getNavigation().pipe(
                    takeUntilDestroyed(this.destroyRef),
                    map((navigation) =>
                        FirebaseActions.loadNavigationSuccess({
                            navigation,
                            images: [],
                        }),
                    ),
                    catchError((error: Error) =>
                        of(FirebaseActions.loadNavigationFailure({ error })),
                    ),
                ),
            ),
        ),
    );

    // ✅ Social Media - обычно не требует изображений
    loadSocialMedia$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.loadSocialMedia),
            switchMap(() =>
                this.apiService.getSocialMediaLinks().pipe(
                    takeUntilDestroyed(this.destroyRef),
                    map((socialMediaLinks) =>
                        FirebaseActions.loadSocialMediaSuccess({
                            socialMediaLinks,
                            images: [],
                        }),
                    ),
                    catchError((error: Error) =>
                        of(FirebaseActions.loadSocialMediaFailure({ error })),
                    ),
                ),
            ),
        ),
    );

    // ✅ Work Experience - изображения уже включены в данные
    loadWorkExperience$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.loadWorkExperience),
            switchMap(() =>
                this.apiService.getWorkExperience().pipe(
                    takeUntilDestroyed(this.destroyRef),
                    map((workExperience) =>
                        FirebaseActions.loadWorkExperienceSuccess({
                            workExperience,
                            images: [],
                        }),
                    ),
                    catchError((error: Error) =>
                        of(
                            FirebaseActions.loadWorkExperienceFailure({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );

    // ✅ Frontend Tech - изображения уже включены в данные
    loadFrontendTech$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.loadFrontendTech),
            switchMap(() =>
                this.apiService.getFrontendTech().pipe(
                    takeUntilDestroyed(this.destroyRef),
                    map((frontendTech) =>
                        FirebaseActions.loadFrontendTechSuccess({
                            frontendTech,
                            images: [],
                        }),
                    ),
                    catchError((error: Error) =>
                        of(FirebaseActions.loadFrontendTechFailure({ error })),
                    ),
                ),
            ),
        ),
    );

    // ✅ Backend Tech - изображения уже включены в данные
    loadBackendTech$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.loadBackendTech),
            switchMap(() =>
                this.apiService.getBackendTech().pipe(
                    takeUntilDestroyed(this.destroyRef),
                    map((backendTech) =>
                        FirebaseActions.loadBackendTechSuccess({
                            backendTech,
                            images: [],
                        }),
                    ),
                    catchError((error: Error) =>
                        of(FirebaseActions.loadBackendTechFailure({ error })),
                    ),
                ),
            ),
        ),
    );

    // ✅ Other Tech - изображения уже включены в данные
    loadOtherTech$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.loadOtherTech),
            switchMap(() =>
                this.apiService.getOtherTech().pipe(
                    takeUntilDestroyed(this.destroyRef),
                    map((otherTech) =>
                        FirebaseActions.loadOtherTechSuccess({
                            otherTech,
                            images: [],
                        }),
                    ),
                    catchError((error: Error) =>
                        of(FirebaseActions.loadOtherTechFailure({ error })),
                    ),
                ),
            ),
        ),
    );

    // ✅ Hard Skills Nav - обычно не требует изображений
    loadHardSkillsNav$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.loadHardSkillsNav),
            switchMap(() =>
                this.apiService.getHardSkillsNav().pipe(
                    takeUntilDestroyed(this.destroyRef),
                    map((hardSkillsNav) =>
                        FirebaseActions.loadHardSkillsNavSuccess({
                            hardSkillsNav,
                            images: [],
                        }),
                    ),
                    catchError((error: Error) =>
                        of(FirebaseActions.loadHardSkillsNavFailure({ error })),
                    ),
                ),
            ),
        ),
    );

    // ✅ Education Places - изображения уже включены в данные
    loadEducationPlaces$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.loadEducationPlaces),
            switchMap(() =>
                this.apiService.getEducationPlaces().pipe(
                    takeUntilDestroyed(this.destroyRef),
                    map((education) =>
                        FirebaseActions.loadEducationPlacesSuccess({
                            education,
                            images: [],
                        }),
                    ),
                    catchError((error: Error) =>
                        of(
                            FirebaseActions.loadEducationPlacesFailure({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );

    // ✅ Main Page Info - может требовать изображения для аватара/фона
    loadMainPageInfo$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.loadMainPageInfo),
            switchMap(({ imgName }) => {
                const mainPageInfo$ = this.apiService.getMainPageInfo();
                const images$ = imgName
                    ? this.apiService.getImages(imgName)
                    : of([]);

                return forkJoin({
                    mainPageInfo: mainPageInfo$,
                    images: images$,
                }).pipe(
                    takeUntilDestroyed(this.destroyRef),
                    map(({ mainPageInfo, images }) => {
                        if (!mainPageInfo) {
                            throw new Error('Main page info not found');
                        }
                        return FirebaseActions.loadMainPageInfoSuccess({
                            mainPageInfo,
                            images: images || [],
                        });
                    }),
                    catchError((error: Error) =>
                        of(FirebaseActions.loadMainPageInfoFailure({ error })),
                    ),
                );
            }),
        ),
    );

    // ✅ Experience Aside - обычно не требует изображений
    loadExperienceAside$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.loadExperienceAside),
            switchMap(() =>
                this.apiService.getExperienceAside().pipe(
                    takeUntilDestroyed(this.destroyRef),
                    map((experienceAside) =>
                        FirebaseActions.loadExperienceAsideSuccess({
                            experienceAside,
                            images: [],
                        }),
                    ),
                    catchError((error: Error) =>
                        of(
                            FirebaseActions.loadExperienceAsideFailure({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );

    // ✅ Technologies Aside - требует изображения для каждой технологии
    loadTechnologiesAside$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.loadTechnologiesAside),
            switchMap(() =>
                this.apiService.getTechnologiesAside().pipe(
                    takeUntilDestroyed(this.destroyRef),
                    switchMap((technologiesAside: TTechnologiesAside[]) => {
                        if (technologiesAside.length === 0) {
                            return of(
                                FirebaseActions.loadTechnologiesAsideSuccess({
                                    technologiesAside: [],
                                    images: [],
                                }),
                            );
                        }

                        // Загружаем изображения для каждой технологии
                        const technologyRequests = technologiesAside.map(
                            (tech: TTechnologiesAside) => {
                                if (tech.imgName) {
                                    return this.apiService
                                        .getImages(tech.imgName)
                                        .pipe(
                                            map((images: string[]) => ({
                                                ...tech,
                                                images: images || [],
                                            })),
                                        );
                                } else {
                                    return of({
                                        ...tech,
                                        images: [] as string[],
                                    });
                                }
                            },
                        );

                        return forkJoin(technologyRequests).pipe(
                            takeUntilDestroyed(this.destroyRef),
                            map((updatedTechnologiesAside) => {
                                // Собираем все изображения в один массив
                                const allImages = updatedTechnologiesAside
                                    .flatMap((tech) => tech.images || [])
                                    .filter((image): image is string =>
                                        Boolean(image),
                                    );

                                return FirebaseActions.loadTechnologiesAsideSuccess(
                                    {
                                        technologiesAside:
                                            updatedTechnologiesAside,
                                        images: allImages,
                                    },
                                );
                            }),
                        );
                    }),
                    catchError((error: Error) =>
                        of(
                            FirebaseActions.loadTechnologiesAsideFailure({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );

    // ✅ Дополнительный эффект для загрузки тематических изображений
    loadThemeImages$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.loadThemeImages),
            switchMap(({ folder, searchParam }) =>
                this.apiService.getImages(folder, searchParam).pipe(
                    takeUntilDestroyed(this.destroyRef),
                    map((images) =>
                        FirebaseActions.loadThemeImagesSuccess({
                            images: images || [],
                        }),
                    ),
                    catchError((error: Error) =>
                        of(FirebaseActions.loadThemeImagesFailure({ error })),
                    ),
                ),
            ),
        ),
    );

    // ✅ Эффект для загрузки любых изображений по папке
    loadImagesByFolder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FirebaseActions.loadImagesByFolder),
            switchMap(({ folder, searchParam }) =>
                this.apiService.getImages(folder, searchParam).pipe(
                    takeUntilDestroyed(this.destroyRef),
                    map((images) =>
                        FirebaseActions.loadImagesByFolderSuccess({
                            folder,
                            images: images || [],
                        }),
                    ),
                    catchError((error: Error) =>
                        of(
                            FirebaseActions.loadImagesByFolderFailure({
                                error,
                                folder,
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );
}
