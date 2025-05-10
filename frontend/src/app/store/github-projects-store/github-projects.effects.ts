import { catchError, map, mergeMap, of } from 'rxjs';

import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { GithubService } from '@core/service/github/github.service';

import { GithubRepositoriesActions } from './github-projects.action';

@Injectable()
export class GithubRepositoriesEffects {
    constructor(
        private _actions$: Actions,
        private _githubService: GithubService,
    ) {}

    public loadPublicRepositories$ = createEffect(() =>
        this._actions$.pipe(
            ofType(GithubRepositoriesActions.getPublicRepositories),
            mergeMap(() =>
                this._githubService.getGithubPublicRepos(1, 100).pipe(
                    map((repositories) =>
                        GithubRepositoriesActions.getPublicRepositoriesSuccess({
                            repositories,
                        }),
                    ),
                    catchError((error) =>
                        of(
                            GithubRepositoriesActions.getPublicRepositoriesError(
                                {
                                    error,
                                },
                            ),
                        ),
                    ),
                ),
            ),
        ),
    );

    public loadPrivateRepositories$ = createEffect(() =>
        this._actions$.pipe(
            ofType(GithubRepositoriesActions.getPrivateRepositories),
            mergeMap(() =>
                this._githubService.getGithubPrivateRepos(1, 100).pipe(
                    map((repositories) =>
                        GithubRepositoriesActions.getPrivateRepositoriesSuccess(
                            {
                                repositories,
                            },
                        ),
                    ),
                    catchError((error) =>
                        of(
                            GithubRepositoriesActions.getPrivateRepositoriesError(
                                {
                                    error,
                                },
                            ),
                        ),
                    ),
                ),
            ),
        ),
    );

    loadRepositoryLanguages$ = createEffect(() =>
        this._actions$.pipe(
            ofType(GithubRepositoriesActions.getRepositoryLanguages),
            mergeMap(({ repoName }) =>
                this._githubService.getRepositoryLanguages(repoName).pipe(
                    map((languages) =>
                        GithubRepositoriesActions.getRepositoryLanguagesSuccess(
                            {
                                repoName,
                                languages,
                            },
                        ),
                    ),
                    catchError((error) =>
                        of(
                            GithubRepositoriesActions.getRepositoryLanguagesError(
                                {
                                    error,
                                },
                            ),
                        ),
                    ),
                ),
            ),
        ),
    );
}
