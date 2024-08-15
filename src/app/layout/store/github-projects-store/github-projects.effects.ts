import { catchError, map, mergeMap, of } from 'rxjs';

import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { GithubService } from '@core/service/github/github.service';

import { GithubRespositoriesActions } from './github-projects.action';

@Injectable()
export class GithubResitoriesEffects {
    constructor(
        private _actions$: Actions,
        private _githubService: GithubService,
    ) {}

    loadRepositories$ = createEffect(() =>
        this._actions$.pipe(
            ofType(GithubRespositoriesActions.getRepositories),
            mergeMap(() =>
                this._githubService.getGithubRepos().pipe(
                    map((repositories) =>
                        GithubRespositoriesActions.getRepositoriesSuccess({
                            repositories,
                        }),
                    ),
                    catchError((error) =>
                        of(
                            GithubRespositoriesActions.getRepositoriesError({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );
}
