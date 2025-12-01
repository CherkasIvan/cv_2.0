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

    loadRepositories$ = createEffect(() =>
        this._actions$.pipe(
            ofType(GithubRepositoriesActions.getRepositories),
            mergeMap(() =>
                this._githubService.getGithubRepos().pipe(
                    map((repositories) =>
                        GithubRepositoriesActions.getRepositoriesSuccess({
                            repositories,
                        }),
                    ),
                    catchError((error) =>
                        of(
                            GithubRepositoriesActions.getRepositoriesError({
                                error,
                            }),
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
